import { EventEmitter } from "@angular/core";
 
export interface AuthStatus {
    authenticated: boolean;
    role?: string;
  }
  
  export class Emitters {
    static authEmitter = new EventEmitter<AuthStatus>();
  }
  