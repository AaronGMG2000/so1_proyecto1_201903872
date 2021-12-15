import time 
from locust import HttpUser, task

class userTest(HttpUser):
    @task
    def acces_model(self):
        self.client.get("/Locust")

    def on_start(self):
        self.client.get("/Locust")