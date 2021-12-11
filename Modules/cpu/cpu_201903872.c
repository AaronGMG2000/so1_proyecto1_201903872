#include <linux/module.h>
#include <linux/proc_fs.h>
#include <linux/hugetlb.h>
#include <linux/sched.h>
#include <linux/mm.h>
#include <linux/sched/signal.h>

MODULE_LICENSE("GPL");
MODULE_DESCRIPTION("Laboratorio Sistemas Operativos 1");
MODULE_AUTHOR("Rudy Aarón Gopal Marroquín Garcia");

struct task_struct *process, *children;
struct list_head *childrens;
unsigned long rss;

static int escribir_archivo(struct seq_file *file, void *v)
{   
    seq_printf(file, "[\n");
    for_each_process(process){
        seq_printf(file, "\t{\n");
        seq_printf(file, "\t\t\"pid\" : %1i,\n", process->pid);
        seq_printf(file, "\t\t\"name\" : \"%1s\",\n", process->comm);
        seq_printf(file, "\t\t\"uid\" : %1i,\n", __kuid_val(process->real_cred->uid));
        seq_printf(file, "\t\t\"state\" : %li,\n", process->state);
        rss = 0;
        if (process->mm){
            rss = get_mm_rss(process->mm);
        }
        seq_printf(file, "\t\t\"ram_usage\" : %lu,\n", rss);
        seq_printf(file, "\t\t\"childrens\": [");
        list_for_each(childrens, &(process->children)){
            children = list_entry(childrens, struct task_struct, sibling);
            seq_printf(file, "\n\t\t{\n"); 
            seq_printf(file, "\t\t\t\"pid\" : %1i,\n", children->pid);
            seq_printf(file, "\t\t\t\"name\" : \"%1s\"\n", children->comm);
            seq_printf(file, "\t\t\t\"state\": %ld,\n", children->state);
            rss = 0;
            if (children->mm){
                rss = get_mm_rss(children->mm);
            }
            seq_printf(file, "\t\t\t\"use_ram\": %lu\n", rss);
            seq_printf(file, "\t\t},");
        }
        seq_printf(file, " ]\n");
        seq_printf(file, "\t}");
    }
    seq_printf(file, "\n]\n");
    return 0;
}

static int al_abrir(struct inode *inode, struct file *file)
{
    return single_open(file, escribir_archivo, NULL);
}

//Si el kernel es 5.6 o mayor se usa la estructura proc_ops
static struct proc_ops operaciones =
{
    .proc_open = al_abrir,
    .proc_read = seq_read
};

static int _insert(void)
{
    proc_create("cpu_201903872", 0, NULL, &operaciones);
    printk(KERN_INFO "Rudy Aarón Gopal Marroquín Garcia\n");
    return 0;
}

static void _remove(void)
{
    remove_proc_entry("cpu_201903872", NULL);
    printk(KERN_INFO "DICIEMBRE 2021\n");
}

module_init(_insert);
module_exit(_remove);