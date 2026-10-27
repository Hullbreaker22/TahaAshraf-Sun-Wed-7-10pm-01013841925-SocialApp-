import { Component, ElementRef, HostListener, inject, input, InputSignal, OnInit, signal, viewChild, WritableSignal } from '@angular/core';
import { CommentsService } from '../../../../core/services/CommentsServices/comments.service';
import { Icomments } from '../../../../core/Models/icomments.interface';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, ɵInternalFormsSharedModule } from '@angular/forms';
import { Ireplies } from '../../../../core/Models/ireplies.interface';
import { IUser } from '../../../../core/Models/iuser.interface';
import { TranslatePipe } from '@ngx-translate/core';
import { SplitPipe } from '../../../../core/Pipes/split-pipe';


@Component({
  selector: 'app-comments',
  imports: [ɵInternalFormsSharedModule , ReactiveFormsModule, TranslatePipe, SplitPipe],
  templateUrl: './comments.component.html',
  styleUrl: './comments.component.css',
})
export class CommentsComponent implements OnInit {
  private readonly commentsBase = inject(CommentsService)
  PoistId: InputSignal<string> = input('');
  CommentId: InputSignal<string> = input('');
  CommentsList:WritableSignal<Icomments[]> = signal([])
  CommentBody:FormControl = new FormControl
  commentImage:WritableSignal<File | null> = signal(null) 
  ImagePreview: WritableSignal<string | null> = signal<string | null>(null);
  Selectedcomment:WritableSignal<string | null> = signal('')
  IsModalOpen:WritableSignal<boolean> = signal(false)
  EdittedComment:WritableSignal<Icomments> = signal({} as Icomments)
  UpdatedBody:FormControl = new FormControl
  UpdatedImage:WritableSignal<File | null> = signal(null);
  UpdatedImagePreview = signal<string | null>(null);
  isImageRemoved = signal<boolean>(false);
  isEmojiPickerOpen = signal<boolean>(false);
  emojisList: string[] = ['😀', '😂', '😍', '👍', '🔥', '❤️', '👏', '🎉', '😎', '😢', '🤔', '🙌'];
  isEmpty:WritableSignal<boolean>  = signal(true)
  textBody = viewChild<ElementRef<HTMLTextAreaElement>>('TextBody')
  repliesList:WritableSignal<Ireplies[]> = signal([])
  LocalUser:WritableSignal<IUser | null> = signal({} as IUser)
  isRepliesOpen:WritableSignal<boolean> = signal(false)
  activeCommentForReplies = signal<string | null>(null);
  ReplyBody: FormControl = new FormControl('');
  replyImage: WritableSignal<File | null> = signal(null);
  ReplyImagePreview: WritableSignal<string | null> = signal<string | null>(null);
  isReplyEmpty: WritableSignal<boolean> = signal(true);


  ngOnInit():void{
    this.getPostComments()
    this.getLocalUser()
  }



  formatPostDate(dateString: string): string {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  
  return date.toLocaleDateString('en-US', {
    month: 'short', 
    day: 'numeric', 
    hour: 'numeric', 
    minute: '2-digit', 
    hour12: true 
  });
}

toggleReplies(commentId: string) {
  if (this.activeCommentForReplies() === commentId) {
    this.activeCommentForReplies.set(null);
  } else {
    this.activeCommentForReplies.set(commentId);
    this.getCommentReplies(commentId);
  }
}

changehidReples(){
  this.isRepliesOpen.update(val => !val)
}

toggleEmojiPicker() {
  this.isEmojiPickerOpen.update(value => !value);
}

addEmoji(emoji: string) {
  const currentValue = this.UpdatedBody.value || '';
  
  this.UpdatedBody.setValue(currentValue + emoji);
  this.isEmojiPickerOpen.set(false);
}

getLocalUser(){
  if(localStorage.getItem('SocialUser') != null){
   this.LocalUser.set(JSON.parse(localStorage.getItem('SocialUser')!))
  }
}

addCommentEmoji(emoji: string) {
  const currentValue = this.CommentBody.value || '';
  
  this.CommentBody.setValue(currentValue + emoji);
  this.isEmojiPickerOpen.set(false);
}

changeReplyEmpty() {
  const value = this.ReplyBody.value || '';
  this.isReplyEmpty.set(value.trim() === '' && !this.replyImage());
}


ReadReplyImage(e: Event) {
  let selectedImage = e.target as HTMLInputElement;
  if (selectedImage && selectedImage.files && selectedImage.files.length > 0) {
    const file = selectedImage.files[0];
    this.replyImage.set(file);
    this.isReplyEmpty.set(false); // طالما حط صورة يفتح زرار الإرسال

    let reader = new FileReader();
    reader.onload = (event) => {
      this.ReplyImagePreview.set(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  }
}

removeReplyImage() {
  this.ReplyImagePreview.set(null);
  this.replyImage.set(null);
  this.changeReplyEmpty();
}


addReplyEmoji(emoji: string) {
  const currentValue = this.ReplyBody.value || '';
  this.ReplyBody.setValue(currentValue + emoji);
  this.isReplyEmpty.set(false);
  this.isEmojiPickerOpen.set(false);
}


SubmitReply(e: SubmitEvent, postId: string, commentId: string) {
  e.preventDefault();
  
  let formData = new FormData();
  formData.append('content', this.ReplyBody.value);
  if (this.replyImage() != null) {
    formData.append('image', this.replyImage()!);
  }

  this.commentsBase.CreateReply(postId, commentId, formData).subscribe({
    next: (res) => {
      this.ReplyBody.reset();
      this.ReplyImagePreview.set(null);
      this.replyImage.set(null);
      this.isReplyEmpty.set(true);
      
      this.getCommentReplies(commentId);
    },
    error: (err) => {
      console.log(err);
    }
  });
}


  changeEmpty(){
    const TextArea = this.textBody()?.nativeElement;
    if(TextArea?.value.trim() == ''){
        this.isEmpty.set(true)
    }else{
      this.isEmpty.set(false)
    }
  }


openEditModal(comment: Icomments) {
  this.EdittedComment.set(comment);
  this.isImageRemoved.set(false); 
  this.UpdatedImagePreview.set(null);
  this.UpdatedBody.setValue(comment.content);
  this.IsModalOpen.set(true);
}

 CloseModal(){
  this.IsModalOpen.set(false)
 }

removeImage() {
  this.UpdatedImagePreview.set(null);
  this.UpdatedImage.set(null);
  this.isImageRemoved.set(true); 
}

  getPostComments():void{
      this.commentsBase.getPostComments(this.PoistId()).subscribe({
        next:(res)=>{
          this.CommentsList.set(res.data.comments)
          
        },error:(err)=>{
          console.log(err);
          
        }
      })
  }
ReadImage(e: Event) {
  let selectedImage = e.target as HTMLInputElement;
  this.isEmpty.set(false)
  if (selectedImage && selectedImage.files && selectedImage.files.length > 0) {
    this.commentImage.set(selectedImage.files[0]);
    
    this.ImageURLreader();
  }
}

checkSelectStatus(commentId:string){
  if(this.Selectedcomment()== commentId){
    this.Selectedcomment.set(null)
  }else{
    this.Selectedcomment.set(commentId)
  }
}

ImageURLreader() {
  const currentImage = this.commentImage();
  if (!currentImage) return; 
  let Reader = new FileReader();

  Reader.onload = (e) => {
    const result = e.target?.result as string;
    this.ImagePreview.set(result);
  };
  Reader.readAsDataURL(currentImage);
}

SubmitForm(e:SubmitEvent, postId:string , formElement:HTMLFormElement){
  const form = e.target as HTMLFormElement;
  e.preventDefault()
  let formData = new FormData
  formData.append('content',this.CommentBody.value)
  if(this.commentImage() != null){
    formData.append('image',this.commentImage()!)
  }

  this.commentsBase.CreateComment(postId,formData).subscribe({
    next:(res)=>{
      form.reset()
      this.ImagePreview.set(null);
      this.commentImage.set(null); 
      this.getPostComments()
    },error:(err)=>{
      console.log(err);
      
    }
  })

}

  LiketheComment(PostId:string , CommentId:string){
    this.commentsBase.LikeComment(PostId, CommentId).subscribe({
      next:(res)=>{
        this.getPostComments()
      },error:(err)=>{
        console.log(err);
        
      }
    })
  }

    LiketheReplies(PostId:string , ReplyId:string , commentID:string ){
    this.commentsBase.LikeComment(PostId, ReplyId).subscribe({
      next:(res)=>{
        this.getCommentReplies(commentID)
      },error:(err)=>{
        console.log(err);
        
      }
    })
  }


  DeleteElement(commentid:string){
    this.commentsBase.DeleteCommente(this.PoistId(),commentid).subscribe({
      next:(res)=>{

        this.getPostComments()
      },error:(err)=>{
          console.log(err);

      }
    })
  }

ReadUpdatedImage(e: Event) {
  this.UpdatedImage.set(null)
  let input = e.target as HTMLInputElement;

  if (input.files && input.files.length > 0) {
    const newFile = input.files[0];
    
    this.isImageRemoved.set(false);

    let reader = new FileReader();
    reader.onload = (event) => {
      const newImageResult = event.target?.result as string;
      const oldImageSrc = this.EdittedComment().image;

      this.UpdatedImagePreview.set(newImageResult);
      this.UpdatedImage.set(newFile);
    };
    reader.readAsDataURL(newFile);
  }
}

  UpdateComment(e:Event,commentId:string){
    e.preventDefault()

    let MetaData = new FormData
    MetaData.append('content',this.UpdatedBody.value)
    if(this.UpdatedImage() != null){
      MetaData.append('image',this.UpdatedImage()!)
    }
    this.commentsBase.UpdateComment(this.PoistId(),commentId,MetaData).subscribe({
      next:(res)=>{

        this.getPostComments()
        this.CloseModal()

      },error:(err)=>{
        console.log(err);
        
      }
    })


  }

  getCommentReplies(commentID:string){
    this.commentsBase.getCommentReplies(this.PoistId(),commentID).subscribe({
      next:(res)=>{
        this.repliesList.set(res.data.replies)
        console.log(res);
        
      
      },error:(err)=>{
        console.log(err);
        
      }
    }) 
  }
}
