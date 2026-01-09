export type CreateMailTemplate = {
  body: string;
  subject: string;
  styles?: string;
};

export type SendPaymentSuccessTemplateProps = {
  userName: string;
  amount: string;
  packageName: string;
  seatsNumber: string;
  date: string;
  transactionId: string;
};
export class MailTemplate {
  static createTemplate(props: CreateMailTemplate) {
    return {
      body: props.body,
      subject: props.subject,
      styles: props.styles || '',
    };
  }

  // This is a template for the payment success email (just a sample, you can cuztomize it)
  static paymentSuccessTemplate(props: SendPaymentSuccessTemplateProps) {
    return this.createTemplate({
      body: `
<p>Dear <span class="bold">${props.userName}</span>,</p>

<p>
  We are pleased to inform you that your payment has been successfully processed. Thank you for your purchase and for choosing our services to enhance your disaster recovery and response, improving your cybersecurity and incident management.
</p>

<h3>Transaction Details:</h3>
<ul>
  <li><span class="bold">Amount:</span> ${props.amount}</li>
  <li><span class="bold">Package:</span> ${props.packageName}</li>
  <li><span class="bold">Seats:</span> ${props.seatsNumber}</li>
  <li><span class="bold">Date:</span> ${props.date}</li>
  <li><span class="bold">Transaction ID:</span> ${props.transactionId}</li>
</ul>

<p>
  Your access to our <span class="bold">${props.packageName}</span> features is now fully activated, and you can continue leveraging the expertise and tools to strengthen your organization’s security posture.
</p>

<p>
  If you have any questions or require further assistance, please do not hesitate to contact our support team at <span class="bold">support@example.com</span>. We are here to help ensure you get the most out of your experience.
</p>

<p>Thank you once again for your trust in our services.</p>

<p>Best regards,<br>
<span class="bold">The Team</span></p>
    `,
      subject: 'Thank you for your purchase!',
    });
  }
}
