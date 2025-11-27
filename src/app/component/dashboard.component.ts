import { Component, ElementRef } from "@angular/core";
import { FormsModule } from "@angular/forms";
import emailjs, { EmailJSResponseStatus } from 'emailjs-com';
import { environment } from "../../environments/enviroment";

@Component({
    selector: "app-dashboard",
    standalone: true,
    imports: [FormsModule],
    templateUrl: "./dashboard.component.html",
    styleUrls: ["./dashboard.component.css"]
})
export class DashboardComponent {
    name: string = '';
    email: string = '';
    message: string = '';
    sent = false;
    error = false;
    emptyFields = false;
    invalidEmail = false;
    isSending = false;

    private words: string[] = ["CODE.", "TEST.", "DEPLOY.", "REPEAT."];
    private wordIndex: number = 0;
    private charIndex: number = 0;
    private isDeleting: boolean = false;
    private typingSpeed: number = 105; 
    private deletingSpeed: number = 55; 
    private pauseDelay: number = 1500;

    constructor(private el: ElementRef) {}

    ngAfterViewInit(): void {
        this.typeEffect(); 
    }
    
    sendEmail(emailCtrl: any) {

        if (!this.name || !this.email || !this.message) {
            this.error = false;
            this.sent = false;
            this.emptyFields = true;
            this.invalidEmail = false;
            this.isSending = false;
            
            setTimeout(() => {
                this.emptyFields = false;
                }, 3000);
            return; 
        }
        if (emailCtrl.invalid) {
            this.invalidEmail = true;
            this.error = false;
            this.sent = false;
            this.isSending = false;
            setTimeout(() => (this.invalidEmail = false), 3000);
            return;
        }

        this.isSending = true;

        const templateParams = {
        from_name: this.name,
        from_email: this.email,
        message: this.message,
        };

        emailjs.send(
            environment.emailServiceId,
            environment.emailTemplateId,
            templateParams,
            environment.emailPublicKey
        )
        .then(() => {
            this.isSending = false;
            this.sent = true;
            this.error = false;

            setTimeout(() => {
            this.sent = false;
            }, 3000);

            this.name = '';
            this.email = '';
            this.message = '';
        })
        .catch(() => {
            this.isSending = false;
            this.error = true;
            this.sent = false;

            setTimeout(() => {
            this.error = false;
            }, 3000);
        });
    }

    scrollTo(sectionId: string) {
        const section = document.getElementById(sectionId);
        if (section) {
            section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }
    private typeEffect(): void {
        const currentWord = this.words[this.wordIndex];
        const textElement = this.el.nativeElement.querySelector('.animated-text') as HTMLElement;
        const containerElement = this.el.nativeElement.querySelector('.animated-text-container') as HTMLElement;
        
        if (!textElement || !containerElement) return;

        if (this.isDeleting) {
            this.charIndex--;
            textElement.textContent = currentWord.substring(0, this.charIndex);
            
            containerElement.classList.remove('done-typing');

            if (this.charIndex === 0) {
                this.isDeleting = false;
                this.wordIndex = (this.wordIndex + 1) % this.words.length; 
                setTimeout(() => this.typeEffect(), 500); 
                return;
            }
            
            containerElement.style.animation = `typing 4s steps(${currentWord.length}, end) infinite, blink-caret 0.75s step-end infinite`;

            setTimeout(() => this.typeEffect(), this.deletingSpeed);

        } else {
            this.charIndex++;
            textElement.textContent = currentWord.substring(0, this.charIndex);
            
            containerElement.style.width = 'auto';
            

            if (this.charIndex === currentWord.length) {
                this.isDeleting = true;
                
                setTimeout(() => this.typeEffect(), this.pauseDelay);
                return;
            }

            setTimeout(() => this.typeEffect(), this.typingSpeed);
        }
    }
}   