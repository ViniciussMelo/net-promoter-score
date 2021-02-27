import fs from 'fs';
import handleBars from 'handlebars';
import nodemailer, { Transporter } from 'nodemailer';

export interface IMailVariables {
    name: string;
    title: string;
    description: string;
    user_id: string;
    link: string;
}

class SendMailService {
    private client: Transporter;

    constructor() {
        nodemailer.createTestAccount().then((account: nodemailer.TestAccount) => {
            const transporter = nodemailer.createTransport({
                host: account.smtp.host,
                port: account.smtp.port,
                secure: account.smtp.secure,
                auth: {
                    user: account.user,
                    pass: account.pass
                }
            });

            this.client = transporter;
        })
    }

    async execute(to: string, subject: string, variables: IMailVariables, path: string) {
        const templateFileContent = fs.readFileSync(path).toString("utf8") // read the file

        const mailTemplateParse = handleBars.compile(templateFileContent);

        // set the context (variables)
        const html = mailTemplateParse(variables);

        const message = await this.client.sendMail({
            to,
            subject,
            html,
            from: "NPS <noreply@nps.com.br>"
        });

        console.log(`Message sent: ${message.messageId}`);
        console.log(`Preview URL: ${nodemailer.getTestMessageUrl(message)}`);
    }
}

export default new SendMailService();