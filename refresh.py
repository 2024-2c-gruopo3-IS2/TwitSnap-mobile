import time
import requests

# Lista de URLs de los microservicios de IS2
MICROSERVICIOS = [
    'https://post-microservice.onrender.com',
    'https://metrics-microservice-hg4i.onrender.com',
    'https://auth-microservice-vvr6.onrender.com',
    'https://profile-microservice.onrender.com'
]

def refresh_microservicios():
    for url in MICROSERVICIOS:
        try:
            requests.get(url)
            print("Refreshed:", url)
        except requests.exceptions.RequestException as e:
            print(f"Error al conectar con {url}: {e}")

if __name__ == "__main__":
    try:
        while True:
            print("Refreshing microservices...")
            refresh_microservicios()
            print("Waiting 10 seconds...")
            time.sleep(10)
    except KeyboardInterrupt:
        print("\nEjecución interrumpida por el usuario (Ctrl + C).")
