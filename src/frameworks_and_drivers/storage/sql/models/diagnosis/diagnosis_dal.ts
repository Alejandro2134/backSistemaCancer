export interface IDiagnosisDAL {
    id?: number;
    cedula: string;
    nombre: string;
    resultado: string;
}

export interface IDiagnosisFDAL {
    cedula?: string;
    nombre?: string;
}

export class DiagnosisDAL implements IDiagnosisDAL {
    id?: number;
    cedula: string;
    nombre: string;
    resultado: string;

    constructor(item: IDiagnosisDAL) {
        this.id = item.id;
        this.cedula = item.cedula;
        this.nombre = item.nombre;
        this.resultado = item.resultado;
    }
}
