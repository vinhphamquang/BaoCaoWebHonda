import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Trong môi trường thực tế, bạn sẽ sử dụng một dịch vụ email như Nodemailer, SendGrid, v.v.
    // Ví dụ với SendGrid:
    // const sgMail = require('@sendgrid/mail');
    // sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    // 
    // const msg = {
    //   to: 'vphamquang539@gmail.com',
    //   from: 'no-reply@hondaplus.com',
    //   subject: `Đặt lịch lái thử từ ${data.name}`,
    //   text: `
    //     Thông tin đặt lịch lái thử:
    //     Họ tên: ${data.name}
    //     Email: ${data.email}
    //     Số điện thoại: ${data.phone}
    //     Mẫu xe: ${data.carModel}
    //     Ngày lái thử: ${data.preferredDate}
    //     Thời gian: ${data.preferredTime}
    //     Địa điểm: ${data.location}
    //     Ghi chú: ${data.message || 'Không có'}
    //   `,
    //   html: `
    //     <h2>Thông tin đặt lịch lái thử</h2>
    //     <p><strong>Họ tên:</strong> ${data.name}</p>
    //     <p><strong>Email:</strong> ${data.email}</p>
    //     <p><strong>Số điện thoại:</strong> ${data.phone}</p>
    //     <p><strong>Mẫu xe:</strong> ${data.carModel}</p>
    //     <p><strong>Ngày lái thử:</strong> ${data.preferredDate}</p>
    //     <p><strong>Thời gian:</strong> ${data.preferredTime}</p>
    //     <p><strong>Địa điểm:</strong> ${data.location}</p>
    //     <p><strong>Ghi chú:</strong> ${data.message || 'Không có'}</p>
    //   `,
    // };
    // 
    // await sgMail.send(msg);
    
    // Giả lập gửi email thành công
    console.log('Đã gửi email đến vphamquang539@gmail.com với thông tin:', data);
    
    return NextResponse.json({ success: true, message: 'Đã gửi thông tin đặt lịch thành công' });
  } catch (error) {
    console.error('Lỗi khi xử lý yêu cầu đặt lịch lái thử:', error);
    return NextResponse.json(
      { success: false, message: 'Có lỗi xảy ra khi xử lý yêu cầu' },
      { status: 500 }
    );
  }
}