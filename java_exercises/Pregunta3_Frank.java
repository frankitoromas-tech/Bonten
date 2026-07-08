class NodoArbol {
    int valor;
    NodoArbol izquierdo;
    NodoArbol derecho;

    public NodoArbol(int valor) {
        this.valor = valor;
        this.izquierdo = null;
        this.derecho = null;
    }
}

class ArbolBST {
    NodoArbol raiz;

    public ArbolBST() {
        raiz = null;
    }

    public void insertar(int valor) {
        raiz = insertarRecursivo(raiz, valor);
    }

    private NodoArbol insertarRecursivo(NodoArbol raiz, int valor) {
        if (raiz == null) {
            raiz = new NodoArbol(valor);
            return raiz;
        }
        if (valor < raiz.valor) {
            raiz.izquierdo = insertarRecursivo(raiz.izquierdo, valor);
        } else if (valor > raiz.valor) {
            raiz.derecho = insertarRecursivo(raiz.derecho, valor);
        }
        return raiz;
    }

    public void preorden() { preordenRecursivo(raiz); System.out.println(); }
    private void preordenRecursivo(NodoArbol nodo) {
        if (nodo != null) {
            System.out.print(nodo.valor + " ");
            preordenRecursivo(nodo.izquierdo);
            preordenRecursivo(nodo.derecho);
        }
    }

    public void inorden() { inordenRecursivo(raiz); System.out.println(); }
    private void inordenRecursivo(NodoArbol nodo) {
        if (nodo != null) {
            inordenRecursivo(nodo.izquierdo);
            System.out.print(nodo.valor + " ");
            inordenRecursivo(nodo.derecho);
        }
    }

    public void postorden() { postordenRecursivo(raiz); System.out.println(); }
    private void postordenRecursivo(NodoArbol nodo) {
        if (nodo != null) {
            postordenRecursivo(nodo.izquierdo);
            postordenRecursivo(nodo.derecho);
            System.out.print(nodo.valor + " ");
        }
    }

    public boolean buscar(int valor) {
        return buscarRecursivo(raiz, valor);
    }

    private boolean buscarRecursivo(NodoArbol raiz, int valor) {
        if (raiz == null) return false;
        if (raiz.valor == valor) return true;
        return valor < raiz.valor ? buscarRecursivo(raiz.izquierdo, valor) : buscarRecursivo(raiz.derecho, valor);
    }

    public void eliminar(int valor) {
        raiz = eliminarRecursivo(raiz, valor);
    }

    private NodoArbol eliminarRecursivo(NodoArbol raiz, int valor) {
        if (raiz == null) return raiz;

        if (valor < raiz.valor) {
            raiz.izquierdo = eliminarRecursivo(raiz.izquierdo, valor);
        } else if (valor > raiz.valor) {
            raiz.derecho = eliminarRecursivo(raiz.derecho, valor);
        } else {
            // Caso 1: Nodo sin hijos (hoja)
            // Caso 2: Nodo con un solo hijo
            if (raiz.izquierdo == null) return raiz.derecho;
            else if (raiz.derecho == null) return raiz.izquierdo;

            // Caso 3: Nodo con dos hijos
            raiz.valor = minValor(raiz.derecho);
            raiz.derecho = eliminarRecursivo(raiz.derecho, raiz.valor);
        }
        return raiz;
    }

    private int minValor(NodoArbol raiz) {
        int minv = raiz.valor;
        while (raiz.izquierdo != null) {
            minv = raiz.izquierdo.valor;
            raiz = raiz.izquierdo;
        }
        return minv;
    }
}

public class Pregunta3_Frank {
    public static void main(String[] args) {
        System.out.println("=== Sistema de Inventario BST - Desarrollado por Frank ===");
        ArbolBST arbol = new ArbolBST();
        int[] codigos = {50, 30, 70, 20, 40, 60, 80, 35, 45, 65};

        System.out.println("\n[a] Insertando los códigos en el árbol...");
        for (int codigo : codigos) {
            arbol.insertar(codigo);
        }

        System.out.println("\n[b] Recorridos del Árbol:");
        System.out.print("Preorden: "); arbol.preorden();
        System.out.print("Inorden:  "); arbol.inorden();
        System.out.print("Postorden: "); arbol.postorden();

        System.out.println("\n[c] Buscando el código 65...");
        boolean encontrado = arbol.buscar(65);
        System.out.println("¿El código 65 fue encontrado? : " + (encontrado ? "Sí" : "No"));

        System.out.println("\n[d] Eliminando el código 30 del árbol...");
        arbol.eliminar(30);
        System.out.print("Recorrido Inorden tras eliminación: ");
        arbol.inorden();

        System.out.println("\n[e] Explicación de la eliminación:");
        System.out.println("Se eliminó el código 30. En este árbol, el nodo 30 tiene DOS HIJOS (20 y 40).");
        System.out.println("Al eliminar un nodo con dos hijos, es necesario reorganizar el árbol para mantener");
        System.out.println("la propiedad del BST (hijos izquierdos menores, hijos derechos mayores).");
        System.out.println("Se reemplazó el valor del nodo 30 por el menor valor de su subárbol derecho (35),");
        System.out.println("y luego se eliminó el nodo duplicado (35) de su posición original.");
    }
}
