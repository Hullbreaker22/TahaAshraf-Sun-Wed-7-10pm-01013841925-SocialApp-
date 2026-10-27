import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UsersService } from '../../core/services/users/users.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  imports: [ReactiveFormsModule , TranslatePipe],
  selector: 'app-sittings',
  styleUrl: './sittings.component.css',
  templateUrl: './sittings.component.html',
})
export class SittingsComponent {

  private readonly UserBase = inject(UsersService)
  private readonly router = inject(Router)
  private readonly toster = inject(ToastrService)
  passForm = new FormGroup({
    password: new FormControl(null,[Validators.required,
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/)]),
    newPassword: new FormControl(null,[Validators.required,
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/)]),
    ConfirmPass: new FormControl(null,[Validators.required,
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/)])
  }, {
    validators: (form) =>
      form.get('newPassword')?.value === form.get('ConfirmPass')?.value
        ? null
        : { mismatch: true }
  });

  subitForm():void{

    if(this.passForm.invalid){
       this.passForm.markAllAsTouched()
    }else{
      let password =  this.passForm.get('password')?.value
      let newPassword =  this.passForm.get('newPassword')?.value
      console.log(password);
      let body = {
        "password": `${password}`,
        "newPassword": `${newPassword}`
      }

      this.UserBase.changePass(body).subscribe({
        next:(res)=>{
          console.log(res);
          this.router.navigate(['/feeds'])
          this.toster.success('Password changed Successfully', 'Done', {
          timeOut: 5000,
          positionClass: 'toast-top-right',
          toastClass: 'ngx-toastr my-custom-toast',  
        });
        },error:(err)=>{
          console.log(err);
          this.toster.error(err.error?.message ?? 'Failed to change password', 'Error')
        }
      
      })


    }


  }
 
  
}
