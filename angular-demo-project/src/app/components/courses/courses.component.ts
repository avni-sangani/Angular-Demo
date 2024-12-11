import {
  Component,
  computed,
  effect,
  inject,
  Input,
  signal,
} from '@angular/core';
// import { Strings } from '../../enum/strings.enum';
import { Course } from '../../interface/course.interface';
import { CourseService } from '../../services/course/course.service';
import { FormsModule, NgForm } from '@angular/forms';
import { NgIf } from '@angular/common';
// import { Subscription } from 'rxjs';
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-courses',
  imports: [FormsModule, NgIf],
  templateUrl: './courses.component.html',
  styleUrl: './courses.component.scss',
})
export class CoursesComponent {
  // @Input() courses: any;
  @Input() isAdmin: boolean = false;
  // @Output() del = new EventEmitter();
  // courses:any= [];
  // courses = signal<any[]>([]);

  // coursesSub!:Subscription;

  //for call services
  private courseService = inject(CourseService);

  courses: any = computed(() => this.courseService.courseSignal());

  constructor() {
    this.isAdmin=true;
    //use effect to automattically respond to changes in the services course signal
    // effect(
    //   () => {
    //     const course = this.courseService.courseSignal();
    //     if (course != this.courses()) {
    //       this.courses.set(course);
    //     }
    //   },
    //   { allowSignalWrites: true }
    // );
  }

  //for edit form

  model = signal<any>({});
  cover = signal<any>(null);
  cover_file = signal<any>(null);
  showError = signal<boolean>(false);
  isModalOpen = signal<boolean>(false); // Signal to open/close modal

  openModal = () => {
    this.isModalOpen.set(true); // Opens the modal
  };
  // Function to open the edit form and populate course details by ID
  editCourse = (courseId: number) => {
    const courseDetails = this.courseService.getCourseById(courseId);
    if (courseDetails) {
      // this.model.set({
      //   id: courseDetails.id,  // Store the course ID to track it
      //   title: courseDetails.title,
      //   description: courseDetails.description,
      //   image: courseDetails.image,
      //   imgName: courseDetails.imgName
      // });
      this.model.set(courseDetails);
      this.cover.set(courseDetails.image); // Set the existing image for preview
      this.openModal(); // Open the modal
    } else {
      console.error('Course not found');
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

  onFileSelected = (event: any) => {
    const file = event.target.files[0];
    if (file) {
      this.cover_file.set(file);
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result?.toString();
        this.cover.set(dataUrl); // Set the new image data
        this.model().imgName = file.name;
      };
      reader.readAsDataURL(file);
      this.showError.set(false);
    }
  };

  clearForm = (form: NgForm) => {
    form.reset();
    // this.cover = null;
    // this.cover_file = null;

    this.cover.set(null);
    this.cover_file.set(null);
  };

  saveCourse = async (form: NgForm) => {
    try {
      const formValue = form.value;

      const data: Course = {
        ...formValue,
        image: this.cover(),
        imgName: this.model().imgName,
        // id:this.courses.length+1
      };

      if (this.model().id) {
        // If editing an existing course, update it
        await this.courseService.updateCourse(this.model().id, data);
      } else {
        // If adding a new course, add it
        await this.courseService.addCourse(data);
      }
      // const data={
      //   ...formValue,
      //   image:this.cover,
      //   id:this.courses.length+1
      // }
      // this.courses=[...this.courses,data]
      // this.setItem(this.courses)
      this.clearForm(form);
      this.closeModal();
    } catch (e) {
      console.log(e);
    }
  };

  closeModal = () => {
    bootstrap.Modal.getInstance(
      document.getElementById('exampleModal')!
    )?.hide();

    // Remove the backdrop manually (if still visible)
    const backdrop = document.querySelector('.modal-backdrop');
    if (backdrop) {
      backdrop.remove();
    }
  };

  ngOnInit() {
    // const courses:any = this.courseService.getCourses();
    // this.courses.set(courses)
    // this.courseService.courses.subscribe({
    //   next:(courses:Course[])=>{
    //     this.courses.set(courses)
    //   },
    //   error:(e)=>{
    //     console.log(e)
    //   }
    // })
  }

  // constructor(private courseService: CourseService){}

  // ngOnInit() {
  //   this.getCourses();
  // }

  // getCourses = () => {
  //   const data = localStorage.getItem(Strings.STORAGE_KEY);
  //   if (data) {
  //     this.courses = JSON.parse(data);
  //   }
  // };

  deleteCourse = (course: Course[]) => {
    this.courseService.deleteCourse(course);
    // this.del.emit(course);
  };

  // ngOnDestroy ()  {
  //   if(this.coursesSub) this.coursesSub.unsubscribe();
  // }
}

//Understanding of signal works use for detect changes

// without signals
// a = 1;
// b = 2;
// c = this.a + this.b;

// with signals
// a1 = signal(1);
// b1 = signal(2);
// c1 = computed(() => this.a1() + this.b1());

// understandSignalUsageWithExample() {
//   // without signals
//   console.log('c before value change: ', this.c);=>3
//   this.a = 4;
//   console.log('c after value change: ', this.c);=>3

//   // with signals
//   console.log('c1 before value change: ', this.c1());=>3
//   this.a1.set(4);
//   console.log('c1 after value change: ', this.c1());=> 6
// }
