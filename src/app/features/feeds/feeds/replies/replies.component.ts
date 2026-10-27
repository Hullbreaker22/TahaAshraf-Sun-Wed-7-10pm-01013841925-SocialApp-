import { Component, inject, signal, WritableSignal, input, InputSignal } from '@angular/core';
import { CommentsService } from '../../../../core/services/CommentsServices/comments.service';

@Component({
  selector: 'app-replies',
  imports: [],
  templateUrl: './replies.component.html',
  styleUrl: './replies.component.css',
})
export class RepliesComponent {
  private readonly RepliesBase = inject(CommentsService)
  PostId:InputSignal<string> = input('')
  commentId:InputSignal<string> = input('')

  getCommentsReplies(){

     this.RepliesBase.getCommentsReplies(this.PostId(),this.commentId()).subscribe({
      next:(res)=>{
        console.log(res);
        
      },error:(err)=>{
        console.log(err);
        
      }
     })
  }


}
