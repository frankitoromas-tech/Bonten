class Paquete {
    String codigo;
    String destinatario;

    public Paquete(String codigo, String destinatario) {
        this.codigo = codigo;
        this.destinatario = destinatario;
    }

    @Override
    public String toString() {
        return "Código: " + codigo + " | Destinatario: " + destinatario;
    }
}

class PilaPaquetes {
    private Paquete[] pila;
    private int cima;
    private int capacidad;

    public PilaPaquetes(int capacidad) {
        this.capacidad = capacidad;
        this.pila = new Paquete[capacidad];
        this.cima = -1;
    }

    public void push(Paquete paquete) {
        if (cima == capacidad - 1) {
            System.out.println("Pila llena. No se pueden registrar más paquetes.");
            return;
        }
        pila[++cima] = paquete;
    }

    public Paquete pop() {
        if (isEmpty()) {
            System.out.println("Pila vacía. No hay paquetes para despachar.");
            return null;
        }
        return pila[cima--];
    }

    public boolean isEmpty() {
        return cima == -1;
    }

    public void mostrarPila() {
        if (isEmpty()) {
            System.out.println("La pila de paquetes está vacía.");
            return;
        }
        System.out.println("--- Contenido de la pila (desde la Cima hasta la Base) ---");
        for (int i = cima; i >= 0; i--) {
            System.out.println(pila[i]);
        }
        System.out.println("----------------------------------------------------------");
    }
}

public class Pregunta1_Bonten {
    public static void main(String[] args) {
        System.out.println("=== Sistema de Mensajería - Desarrollado por Bonten Core ===");
        PilaPaquetes pila = new PilaPaquetes(10);

        // 1. Registrar 10 paquetes mediante la operación Push
        System.out.println("\n[+] Registrando 10 paquetes...");
        for (int i = 1; i <= 10; i++) {
            pila.push(new Paquete("PKG-" + i, "Cliente " + i));
        }

        // 2. Atender los últimos 4 paquetes utilizando la operación Pop
        System.out.println("\n[-] Atendiendo (despachando) los últimos 4 paquetes:");
        for (int i = 0; i < 4; i++) {
            Paquete atendido = pila.pop();
            if (atendido != null) {
                System.out.println("Despachado: " + atendido);
            }
        }

        // 3. Mostrar el contenido final de la pila desde la cima hasta la base
        System.out.println("\n[i] Estado actual de la pila:");
        pila.mostrarPila();

        // 4. Verificar e indicar si la pila se encuentra vacía al finalizar
        System.out.println("\n[?] ¿La pila se encuentra vacía? : " + (pila.isEmpty() ? "Sí" : "No"));
    }
}
