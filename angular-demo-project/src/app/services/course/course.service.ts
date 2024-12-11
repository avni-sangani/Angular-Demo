import { Injectable, signal, WritableSignal } from '@angular/core';
import { Strings } from '../../enum/strings.enum';
import { Course } from '../../interface/course.interface';
// import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CourseService {
  //initialize the value
  // private courses$ = new BehaviorSubject<Course[]>([]);

  //for observe the courses values changes
  // get courses() {
  //   return this.courses$.asObservable();
  // }

  //cretae signal to hold the course array
  private courses: WritableSignal<Course[]> = signal<Course[]>([]);

  //getter to expose the signal as a readonly signal
  get courseSignal() {
    return this.courses.asReadonly();
  }

  constructor() {
    this.loadCourses();
  }

  loadCourses() {
    const data = localStorage.getItem(Strings.STORAGE_KEY);
    if (data) {
      const courses = JSON.parse(data);
      // return courses;
      //for update observable values
      // this.updateCourses(courses);

      this.courses.set(courses);
    }
  }

  getCourses(): Course[] {
    return this.courses();
  }

  addCourse = (data: Course) => {
    // const courses = this.courses$.value;
    // const newcourses = [...courses, { ...data, id: courses.length + 1 }];
    // this.updateCourses(newcourses);

    // const courses = this.courses();
    // const newCourses = { ...data, id: courses.length + 1 };
    // const updatedCourse = [...courses, newCourses];

    // this.courses.update((courses_data) => [...courses_data, newCourses]);

    // //save in local storage
    // this.setItem(updatedCourse);

    // return updatedCourse;

    let updatedCourses: Course[] = [];

    this.courses.update((courses) => {
      const newCourses = { ...data, id: courses.length + 1 };
      updatedCourses = [...courses, newCourses];
      this.setItem(updatedCourses);
      return updatedCourses;
    });
    return updatedCourses;
  };
  // updateCourses(data: Course[]) {
  //   this.courses$.next(data);
  // }

  // Get a course by ID
  getCourseById(courseId: number): Course | undefined {
    return this.courses().find((course) => course.id === courseId);
  }

  // Update a course by ID
  updateCourse = (id: number, updatedCourse: Course) => {
    const courses = this.courses(); // Get the current courses
    const index = courses.findIndex((course) => course.id === id); // Find the course by ID
    if (index !== -1) {
      // Update the course at the specified index
      courses[index] = { ...courses[index], ...updatedCourse };
      this.setItem(courses); // Save the updated courses back to localStorage
    }
  };

  setItem = (data: Course[]) => {
    localStorage.setItem(Strings.STORAGE_KEY, JSON.stringify(data));
  };

  deleteCourse = (data: any) => {
    // let courses = this.courses$.value;
    // courses= courses.filter(course_item =>course_item.id != data.id)
    // this.updateCourses(courses);
    // this.setItem(courses)

    this.courses.update((courses) => {
      const updateCourses = courses.filter(
        (course_item) => course_item.id != data.id
      );
      this.setItem(updateCourses);
      return updateCourses;
    });
  };
}
