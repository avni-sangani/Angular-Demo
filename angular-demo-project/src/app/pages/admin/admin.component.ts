import { NgIf } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { CoursesComponent } from '../../components/courses/courses.component';
import { CourseService } from '../../services/course/course.service';
import { Course } from '../../interface/course.interface';

@Component({
  selector: 'app-admin',
  imports: [FormsModule, NgIf, CoursesComponent],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss',
})
export class AdminComponent {
  // model: any = {};
  // cover!: any;
  // coverr_file: any;
  // showError: boolean = false;
  // courses: any[] = [];

  //create with signals
  model=signal<any>({})
  cover=signal<any>(null)
  cover_file=signal<any>(null)
  showError=signal<boolean>(false)
  img_name=signal<any>(null)

  private courseService = inject(CourseService);

  onFileSelected = (event: any) => {
    const file = event.target.files[0];
    if (file) {
      this.cover_file.set(file) ;
      const reader = new FileReader();

      reader.onload = () => {
        const dataUrl= reader.result?.toString();
        // this.cover = reader.result?.toString();
        this.cover.set(dataUrl)
        this.model().imgName = file.name;
      };
      reader.readAsDataURL(file);
      // this.showError = false;
      this.showError.set(false);
    }
  };
  onSubmit = (form: NgForm) => {
    if (form.invalid || !this.cover) {
      form.control.markAllAsTouched();
      if (!this.cover) {
        // this.showError = true;
        this.showError.set(false);
      }
      return;
    }
    this.saveCourse(form);
  };

  clearForm = (form: NgForm) => {
    form.reset();
    // this.cover = null;
    // this.cover_file = null;

    this.cover.set(null)
    this.cover_file.set(null)

  };

  saveCourse = async (form: NgForm) => {
    try {
      const formValue = form.value;

      const data: Course = {
        ...formValue,
        image: this.cover(),
        imgName:this.cover_file().name
        // id:this.courses.length+1
      };

      await this.courseService.addCourse(data);
      // const data={
      //   ...formValue,
      //   image:this.cover,
      //   id:this.courses.length+1
      // }
      // this.courses=[...this.courses,data]
      // this.setItem(this.courses)
      this.clearForm(form);
    } catch (e) {
      console.log(e)
    }
  };

  // deleteCourse=(course:any) =>{
  //   this.courses= this.courses.filter(course_item =>course_item.id != course.id)
  //   this.setItem(this.courses)
  // }
}
