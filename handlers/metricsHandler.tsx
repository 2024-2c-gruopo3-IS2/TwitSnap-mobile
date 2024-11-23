import { getToken } from './authTokenHandler';
const API_URL = 'https://metrics-microservice.onrender.com';

/**
 @router.post("/metrics/{metric_name}")
 def add_metric(metric_name: str, value, _ = Depends(get_admin_from_token)):
 */

export async function addMetric(metric_name: string, value: any): Promise<void> {

    try {
        const response = await fetch(`${API_URL}/metrics/${metric_name}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ value }),
        });

        const data = await response.json();
        if (data?.data?.status === 'ok') {
        console.log(`Métrica ${metric_name} agregada con éxito`);
        } else {
        console.error('Error al agregar la métrica:', data);
        }
    } catch (error) {
        console.error("Error en addMetric:", error);
    }
    }