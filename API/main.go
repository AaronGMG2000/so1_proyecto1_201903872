package main

import (
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"os/exec"
	"time"

	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{CheckOrigin: func(r *http.Request) bool {
	return true
}}

func socket(w http.ResponseWriter, r *http.Request) {
	use_socket, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Print(err)
		return
	}
	defer use_socket.Close()
	duration := time.Duration(2) * time.Second
	for {
		ram := "/proc/memo_201903872"
		bytesLeidos, err2 := ioutil.ReadFile(ram)
		cmd := exec.Command("sh", "-c", "free --mega | head -n 2 | tail -n 1 | awk '{print $6}'")
		out, err := cmd.CombinedOutput()
		if err != nil {
			log.Println(err)
			return
		}
		data := string(bytesLeidos) + "\"cacheram\": " + string(out[:]) + "\n}\n"
		if err2 != nil {
			log.Println(err2)
			return
		}
		err = use_socket.WriteMessage(1, []byte(data))
		if err != nil {
			log.Println(err)
			return
		}
		time.Sleep(duration)
	}
}

func cpu(w http.ResponseWriter, r *http.Request) {
	use_socket, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Print(err)
		return
	}
	defer use_socket.Close()
	duration := time.Duration(2) * time.Second
	for {
		ram := "/proc/cpu_201903872"
		bytesLeidos, err2 := ioutil.ReadFile(ram)
		if err2 != nil {
			log.Println(err2)
			return
		}
		err = use_socket.WriteMessage(1, bytesLeidos)
		if err != nil {
			log.Println(err)
			return
		}
		time.Sleep(duration)
	}
}

func main() {
	log.Println("Server on Port 3000")
	http.HandleFunc("/WebSocketRam", socket)
	http.HandleFunc("/WebSocketCpu", cpu)
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintf(w, "Hello World")
	})
	log.Fatal(http.ListenAndServe(":3000", nil))
}
