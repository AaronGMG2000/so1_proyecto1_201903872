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
unsigned long memo_ram;

static int escribir_archivo(struct seq_file *file, void *v)
{   
    int n = 0;
    int n1 = 0;
    seq_printf(file, "[\n");
    for_each_process(process){
        if (n == 0){
            seq_printf(file, "  {\n");
        }else{
            seq_printf(file, "  ,\n{\n");
        }
        seq_printf(file, "      \"pid\" : %1i,\n", process->pid);
        seq_printf(file, "      \"name\" : \"%1s\",\n", process->comm);
        seq_printf(file, "      \"uid\" : %1i,\n", __kuid_val(process->real_cred->uid));
        seq_printf(file, "      \"state\" : %li,\n", process->state);
        memo_ram = 0;
        if (process->mm){
            memo_ram = get_mm_rss(process->mm);
        }
        seq_printf(file, "      \"ram_usage\" : %lu,\n", memo_ram);
        seq_printf(file, "      \"childrens\": [");
        n1 = 0;
        list_for_each(childrens, &(process->children)){
            children = list_entry(childrens, struct task_struct, sibling);
            if (n1 == 0){
                seq_printf(file, "\n        {\n"); 

            }else{
                seq_printf(file, ",\n       {\n"); 
            }
            seq_printf(file, "          \"pid\" : %1i,\n", children->pid);
            seq_printf(file, "          \"name\" : \"%1s\",\n", children->comm);
            seq_printf(file, "          \"state\": %ld,\n", children->state);
            memo_ram = 0;
            if (children->mm){
                memo_ram = get_mm_rss(children->mm);
            }
            seq_printf(file, "          \"use_ram\": %lu\n", memo_ram);
            seq_printf(file, "        }");
            n1 = 1;
        }
        n = 1;
        seq_printf(file, " ]\n");
        seq_printf(file, "  }");
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