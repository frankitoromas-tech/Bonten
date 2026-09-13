class Paciente {
    String codigo;
    String nombre;
    int prioridad; // A mayor número, mayor urgencia
    Paciente siguiente;

    public Paciente(String codigo, String nombre, int prioridad) {
        this.codigo = codigo;
        this.nombre = nombre;
        this.prioridad = prioridad;
        this.siguiente = null;
    }

    @Override
    public String toString() {
        return "Prioridad: " + prioridad + " | Código: " + codigo + " | Nombre: " + nombre;
    }
}

class ColaPrioridadHospital {
    private Paciente frente;

    public ColaPrioridadHospital() {
        this.frente = null;
    }

    public void encolar(String codigo, String nombre, int prioridad) {
        Paciente nuevo = new Paciente(codigo, nombre, prioridad);

        // Si la cola está vacía o el nuevo tiene más prioridad que el frente
        if (frente == null || prioridad > frente.prioridad) {
            nuevo.siguiente = frente;
            frente = nuevo;
        } else {
            // Buscar la posición donde insertarlo
            Paciente actual = frente;
            while (actual.siguiente != null && actual.siguiente.prioridad >= prioridad) {
                actual = actual.siguiente;
            }
            nuevo.siguiente = actual.siguiente;
            actual.siguiente = nuevo;
        }
    }

    public Paciente desencolar() {
        if (frente == null) {
            System.out.println("Cola vacía. No hay pacientes en espera.");
            return null;
        }
        Paciente atendido = frente;
        frente = frente.siguiente;
        return atendido;
    }

    public void mostrarCola() {
        if (frente == null) {
            System.out.println("No hay pacientes en espera.");
            return;
        }
        System.out.println("--- Pacientes en espera (Ordenados por Prioridad) ---");
        Paciente actual = frente;
        while (actual != null) {
            System.out.println(actual);
            actual = actual.siguiente;
        }
        System.out.println("-----------------------------------------------------");
    }
}

public class Pregunta2_Frank {
    public static void main(String[] args) {
        System.out.println("=== Sistema de Triage Hospitalario - Desarrollado por Frank ===");
        ColaPrioridadHospital cola = new ColaPrioridadHospital();

        // 1. Registrar 8 pacientes
        System.out.println("\n[+] Registrando 8 pacientes...");
        cola.encolar("PAC-01", "Ana Rojas", 2);
        cola.encolar("PAC-02", "Luis Gomez", 1);
        cola.encolar("PAC-03", "Carlos Paz (Critico)", 5);
        cola.encolar("PAC-04", "Maria Diaz", 3);
        cola.encolar("PAC-05", "Jorge Vega (Emergencia)", 4);
        cola.encolar("PAC-06", "Rosa Ruiz", 1);
        cola.encolar("PAC-07", "Pedro Lima", 2);
        cola.encolar("PAC-08", "Sofia Ortiz (Grave)", 5);

        // 2. Atender los 3 pacientes con mayor prioridad
        System.out.println("\n[-] Atendiendo a los 3 pacientes más urgentes:");
        for (int i = 0; i < 3; i++) {
            Paciente atendido = cola.desencolar();
            if (atendido != null) {
                System.out.println("Atendido: " + atendido);
            }
        }

        // 3. Mostrar la cola resultante
        System.out.println("\n[i] Cola resultante tras atenciones:");
        cola.mostrarCola();
    }
}
