import { Component } from '@angular/core';
import { CoursesComponent } from '../../components/courses/courses.component';
// import { Strings } from '../../enum/strings.enum';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [CoursesComponent,RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  // courses:any[]=[];

  // ngOnInit(){
  //   this.getCourses();
  // }

  // getCourses=()=>{
  //   const data = localStorage.getItem(Strings.STORAGE_KEY);
  //   if(data){
  //     this.courses = JSON.parse(data)
  //   } 
  // }
}
