export class CreateStudentDto {
    name: string;
    birthDate: string;
    document: string;
    address: string;
    bloodType: string;
    shift: string;
    school: string;
    registrationNumber: string;
    filiation: string;
    contact: string;
    photoUrl?: string;
    sportIds?: number[]; // ID dos esportes
}