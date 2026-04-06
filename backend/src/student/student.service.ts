import { Injectable } from '@nestjs/common';
import CreateStudentDto from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Student } from './entities/student.entity';
import { Repository } from 'typeorm';

@Injectable()
export class StudentService {
  constructor(
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
  ) {}

  create(createStudentDto: CreateStudentDto) {
    return this.studentRepository.save(createStudentDto);
  }

  findAll() {
    return this.studentRepository.find();
  }

  findOne(id: string) {
    return this.studentRepository.findOne({ where: { id } });
  }

  update(id: string, updateStudentDto: UpdateStudentDto) {
    return this.studentRepository.update(id, updateStudentDto);
  }

  remove(id: string) {
    return this.studentRepository.delete(id);
  }
}
