import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PostsService {
  private readonly httpClient = inject(HttpClient);

  getAllposts(page: number = 1): Observable<any> {
    return this.httpClient.get(`${environment.baseURL}/posts/?page=${page}`, { headers: {
      'AUTHORIZATION': `Bearer ${localStorage.getItem('SocialKey')}`
    }});
  }

  getFeedPosts(page: number = 1): Observable<any> {
    return this.httpClient.get(`${environment.baseURL}/posts/feed?only=following&page=${page}`, { headers: {
      'AUTHORIZATION': `Bearer ${localStorage.getItem('SocialKey')}`
    }});
  }

  CreatePost(data: any) {
    return this.httpClient.post(`${environment.baseURL}/posts`, data);
  }

  getMyPosts(userId: string, page: number = 1): Observable<any> {
    return this.httpClient.get(`${environment.baseURL}/users/${userId}/posts?page=${page}`);
  }

  getSinglePost(postid: string): Observable<any> {
    return this.httpClient.get(`${environment.baseURL}/posts/${postid}`);
  }

  BookMarkPost(postId: string): Observable<any> {
    return this.httpClient.put(`${environment.baseURL}/posts/${postId}/bookmark`, {});
  }

  getMarkedPosts(page: number = 1): Observable<any> {
    return this.httpClient.get(`${environment.baseURL}/users/bookmarks?page=${page}`);
  }

  DeletePost(postId: string): Observable<any> {
    return this.httpClient.delete(`${environment.baseURL}/posts/${postId}`);
  }

  LikePost(PostId: string): Observable<any> {
    return this.httpClient.put(`${environment.baseURL}/posts/${PostId}/like`, {});
  }

  SharePost(postId: string, body: any): Observable<any> {
    return this.httpClient.post(`${environment.baseURL}/posts/${postId}/share`, body);
  }

  UpdatePost(postId: string, data: any): Observable<any> {
    return this.httpClient.put(`${environment.baseURL}/posts/${postId}`,data)
  }

  
}