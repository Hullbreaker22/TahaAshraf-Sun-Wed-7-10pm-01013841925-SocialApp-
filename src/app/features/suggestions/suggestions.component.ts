import { Location } from '@angular/common';
import { Component, computed, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { UsersService } from '../../core/services/users/users.service';
import { ISuggestedUser } from '../../core/Models/isuggested-user.interface';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SplitPipe } from '../../core/Pipes/split-pipe';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  imports: [RouterLink, FormsModule, TranslatePipe],
  selector: 'app-suggestions',
  styleUrl: './suggestions.component.css',
  templateUrl: './suggestions.component.html',
})
export class SuggestionsComponent implements OnInit {




  private readonly Location = inject(Location)
  private readonly SuggestionsBase = inject(UsersService)
  SuggestedList:WritableSignal<ISuggestedUser[]> = signal([])
  SeatchBar:WritableSignal<string> = signal('')
  searchLimit:WritableSignal<number> = signal(10)
  FilteredList = computed(()=>{
    const list = this.SuggestedList()
    const filter = this.SeatchBar().toLowerCase()
    if(!filter) return list;

  return   list.filter(S=>S.name.toLocaleLowerCase().includes(filter) || S.username.toLocaleLowerCase().includes(filter))
  })

  ngOnInit(): void {
    this.GetAllSuggestoins()
  }


  goBack(){
    this.Location.back()
  }

  GetAllSuggestoins(){
    this.SuggestionsBase.getSuggestionsList(this.searchLimit()).subscribe({
      next:(res)=>{
        console.log(res);  
        this.SuggestedList.set(res.data.suggestions)     
      },error:(err)=>{
        console.log(err);
        
      }
    })
  }

  loadmoreSuggestions(){
    this.searchLimit.update(val=>val+10)
    this.GetAllSuggestoins()
  }

  followUser(userId:string){

    this.SuggestionsBase.FolloUser(userId).subscribe({
      next:(res)=>{
        console.log(res);
        
        
      },error:(err)=>{
        console.log(err);
        
      }
    })
  }
SearchFunction() {
  const query = this.SeatchBar().toLowerCase();
  console.log(query);

  if (!query) {
    this.GetAllSuggestoins();
    return;
  }

  this.SuggestedList.update(Sugg => 
    Sugg.filter(S => S.name.toLowerCase().includes(query))
  );
}

}
