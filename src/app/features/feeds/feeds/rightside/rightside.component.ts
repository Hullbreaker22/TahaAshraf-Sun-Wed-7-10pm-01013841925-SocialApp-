import { Component, ElementRef, inject, InputSignal, OnInit, signal, WritableSignal, input, viewChild } from '@angular/core';
import { UsersService } from '../../../../core/services/users/users.service';
import { ISuggestedUser } from '../../../../core/Models/isuggested-user.interface';
import { finalize, map } from 'rxjs';
import { IUser } from '../../../../core/Models/iuser.interface';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-rightside',
  imports: [RouterLink , TranslatePipe],
  templateUrl: './rightside.component.html',
  styleUrl: './rightside.component.css',
})
export class RightsideComponent implements OnInit {
  ngOnInit(): void {
    this.getUsers()
    this.GetlockalUser()
  }

  SuggestedList:WritableSignal<ISuggestedUser[]> = signal([]) 
  
   private readonly UsersBase = inject(UsersService)
   searchInput = viewChild<ElementRef<HTMLInputElement>>('SearchInput');
   filtervalue:WritableSignal<string> = signal('')
   isFollowed:WritableSignal<boolean> = signal(false)
   isLoading:WritableSignal<boolean> = signal(false)
   LocalUser:WritableSignal<IUser> = signal({} as IUser)
   Limits:WritableSignal<number> = signal(50)
  setFilterValue(){
    let Search = this.searchInput()?.nativeElement;
    this.filtervalue.set(`${Search?.value}`)
    this.getUsers()
    
  }

getUsers() {
  this.UsersBase.getSuggestionsList(this.Limits()).subscribe({
    next: (res) => {
      const allUsers: ISuggestedUser[] = res.data.suggestions;
      const filtered = allUsers.filter(user => 
        user.name.toLowerCase().includes(`${this.filtervalue()}`.toLowerCase())
      );
      if(this.filtervalue().trim() != ''){
        this.SuggestedList.set(filtered);
      }else{
         this.SuggestedList.set(allUsers);
      }

    },
    error: (err) => {
      console.log(err);    
    }
  });
}


FollowUnfollowUser(userId:string){

  this.isLoading.set(true)  
  if(userId){
    this.UsersBase.FolloUser(userId).pipe(finalize(()=>{
      this.isLoading.set(false)
    })).subscribe({
      next:(res)=>{
        this.getUsers()
        this.isFollowed.set(res.data.following)
        
      },error:(err)=>{
        console.log(err);
      }
    })
  }


}

GetlockalUser(){
  let savedUser = localStorage.getItem('SocialUser')
  if(JSON.parse(savedUser!)){
    this.LocalUser.set(JSON.parse(savedUser!))
  }
}

}
