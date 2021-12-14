package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"os/exec"
	"strings"
	"time"

	"github.com/gorilla/mux"
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
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
	use_socket, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Print(err)
		return
	}
	defer use_socket.Close()
	duration := time.Duration(6) * time.Second
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

func prueba(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
	cmd := exec.Command("sh", "-c", "cut -d: -f1,3 /etc/passwd")
	out, err := cmd.CombinedOutput()
	if err != nil {
		log.Println(err)
		return
	}
	str1 := strings.Replace(string(out[:]), "\n", ",\n\"", -1)
	str2 := strings.Replace(str1, ":", "\":", -1)
	str3 := "\n{\n\"" + string(str2[0:len(str2)-3]) + "\n}"
	json.NewEncoder(w).Encode(str3)
}

type kills struct {
	PID string `json:PID`
}

func kill(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
	var k kills
	reqbody, err := ioutil.ReadAll(r.Body)
	if err != nil {
		fmt.Fprintf(w, "error en kill")
	}
	json.Unmarshal(reqbody, &k)
	comand := "kill -9 " + k.PID
	cmd := exec.Command("sh", "-c", comand)
	out, err := cmd.CombinedOutput()
	if err != nil {
		log.Println(err)
		return
	}
	json.NewEncoder(w).Encode("Elemento eliminado: " + string(out[:]))
}

func main() {
	router := mux.NewRouter()
	log.Println("Server on Port 3000")
	router.HandleFunc("/WebSocketRam", socket)
	router.HandleFunc("/WebSocketCpu", cpu)
	router.HandleFunc("/", prueba).Methods("GET", "OPTIONS")
	router.HandleFunc("/kill", kill).Methods("POST", "OPTIONS")
	log.Fatal(http.ListenAndServe(":3000", router))
}
