import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { env } from 'process';

@Injectable({
  providedIn: 'root',
})
export class CommentsService {
 private readonly httpclient = inject(HttpClient)

 getPostComments(postId: any):Observable<any>{
   return this.httpclient.get(`${environment.baseURL}/posts/${postId}/comments?page=1&limit=10`)} 


   getCommentsReplies(postId:string ,commentId:string ){
     return this.httpclient.get(`${environment.baseURL}/posts/${postId}/comments/${commentId}/replies`)
   }


   LikeComment(postId:string , commentId:string):Observable<any>{
    return this.httpclient.put(`${environment.baseURL}/posts/${postId}/comments/${commentId}/like`,{})
   }


   CreateComment(postId:string , data:any ):Observable<any>{
      return this.httpclient.post(`${environment.baseURL}/posts/${postId}/comments`,data)
   }

   DeleteCommente(postId:string,commentId:string):Observable<any>{

    return this.httpclient.delete(`${environment.baseURL}/posts/${postId}/comments/${commentId}`)
   }


   UpdateComment(postId:string , commentId:string , data:any):Observable<any>{
    return this.httpclient.put(`${environment.baseURL}/posts/${postId}/comments/${commentId}`,data)
   }

   getCommentReplies(postId:string, commentId:string):Observable<any>{
    return this.httpclient.get(`${environment.baseURL}/posts/${postId}/comments/${commentId}/replies?page=1&limit=10`)
   }

   CreateReply(postId:string , commentId:string, data:any):Observable<any>{
    return this.httpclient.post(`${environment.baseURL}/posts/${postId}/comments/${commentId}/replies`,data)
   }


}
