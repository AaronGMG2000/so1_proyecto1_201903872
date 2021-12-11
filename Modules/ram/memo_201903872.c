#include <linux/module.h>
#include <linux/kernel.h>
#include <linux/init.h>
#include <linux/proc_fs.h>
#include <asm/uaccess.h>	
#include <linux/seq_file.h>
#include <linux/hugetlb.h>

MODULE_LICENSE("GPL");
MODULE_DESCRIPTION("Módulo de Memoria");
MODULE_AUTHOR("Rudy Aarón Gopal Marroquín Garcia");

struct sysinfo system_info;


static int escribir_archivo(struct seq_file *archivo, void *v)
{   
    si_meminfo(&system_info);
    unsigned long totalram = (system_info.totalram * system_info.mem_unit)/(1024*1024);
    unsigned long freeram = (system_info.freeram * system_info.mem_unit)/(1024*1024);
    unsigned long useram = totalram - freeram;

    seq_printf(archivo, "{\n");
    seq_printf(archivo, "\"totalram\": %8li,\n", totalram);
    seq_printf(archivo, "\"freeram\": %8li,\n", freeram);
    seq_printf(archivo, "\"useram\": %8li,\n", useram);
    return 0;
}

static int al_abrir(struct inode *inode, struct file *file)
{
    return single_open(file, escribir_archivo, NULL);
}

static struct proc_ops operaciones =
{
    .proc_open = al_abrir,
    .proc_read = seq_read
};

static int _insert(void)
{
    proc_create("memo_201903872", 0, NULL, &operaciones);
    printk(KERN_INFO "201903872\n");
    return 0;
}

static void _remove(void)
{
    remove_proc_entry("memo_201903872", NULL);
    printk(KERN_INFO "Laboratorio Sistemas Operativos 1\n");
}

module_init(_insert);
module_exit(_remove);