import { Component } from "@angular/core";
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

    constructor() {}

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

}   