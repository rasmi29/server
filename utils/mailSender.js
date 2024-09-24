const nodemailer = require('nodemailer');

const mailSender = async (email,title,body)=>{
    try{
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD
            }
        })

        let info = await transporter.sendMail({
            from:"Rasmiranjan Sahoo || StudyNotion",
            to: `${email}`,
            subject: `${title}`,
            html: `<p>${body}</p>`
        })

        console.log(info);
        return info;

    }
    catch(error){
        console.error('Error occurred while sending email:', error);
        return;

    }
    
}