import { Resend } from "resend";
import { NextRequest, NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      improvement,
      followUp,
      exercisesClarity,
      overallRating,
      wouldRecommend,
      suggestions,
    } = body;

    const improvementLabels: Record<string, string> = {
      significant: "نعم بشكل كبير",
      slight: "تحسن بسيط",
      none: "لم أشعر بتحسن",
      worse: "ساءت الحالة",
    };

    const yesNoLabels: Record<string, string> = {
      yes: "نعم",
      somewhat: "إلى حد ما",
      no: "لا",
      maybe: "ربما",
    };

    const htmlContent = `
      <!DOCTYPE html>
      <html dir="rtl" lang="ar">
      <head>
        <meta charset="UTF-8">
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f4f4f4;
            padding: 20px;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            background: white;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          }
          .header {
            background: linear-gradient(135deg, #A7AD89 0%, #8B9168 100%);
            color: white;
            padding: 30px;
            text-align: center;
          }
          .header h1 {
            margin: 0;
            font-size: 24px;
          }
          .content {
            padding: 30px;
          }
          .question {
            margin-bottom: 25px;
            padding-bottom: 20px;
            border-bottom: 1px solid #eee;
          }
          .question:last-child {
            border-bottom: none;
          }
          .question-title {
            color: #A7AD89;
            font-weight: bold;
            margin-bottom: 8px;
            font-size: 16px;
          }
          .answer {
            color: #555;
            font-size: 15px;
            padding: 10px;
            background: #f9f9f9;
            border-radius: 5px;
            border-right: 3px solid #A7AD89;
          }
          .stars {
            color: #FFD700;
            font-size: 20px;
            letter-spacing: 2px;
          }
          .footer {
            background: #f9f9f9;
            padding: 20px;
            text-align: center;
            font-size: 12px;
            color: #999;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📋 استبيان تقييم جديد</h1>
            <p style="margin: 5px 0 0 0; opacity: 0.9;">تم استلام تقييم جديد من أحد العملاء</p>
          </div>

          <div class="content">
            <div class="question">
              <div class="question-title">١. هل شعرت بتحسن بعد الجلسات؟</div>
              <div class="answer">${improvementLabels[improvement] || improvement}</div>
            </div>

            <div class="question">
              <div class="question-title">٢. هل تم متابعتك بعد الجلسة بشكل مناسب؟</div>
              <div class="answer">${yesNoLabels[followUp] || followUp}</div>
            </div>

            <div class="question">
              <div class="question-title">٣. هل كانت التمارين المنزلية واضحة وسهلة التطبيق؟</div>
              <div class="answer">${yesNoLabels[exercisesClarity] || exercisesClarity}</div>
            </div>

            <div class="question">
              <div class="question-title">٤. ما تقييمك العام للخدمة؟</div>
              <div class="answer">
                <div class="stars">${"★".repeat(overallRating)}${"☆".repeat(5 - overallRating)}</div>
                <div style="margin-top: 5px;">${overallRating} من 5</div>
              </div>
            </div>

            <div class="question">
              <div class="question-title">٥. هل ستوصي الآخرين بالعلاج هنا؟</div>
              <div class="answer">${yesNoLabels[wouldRecommend] || wouldRecommend}</div>
            </div>

            ${suggestions
        ? `
            <div class="question">
              <div class="question-title">٦. اقتراحات لتحسين الخدمة:</div>
              <div class="answer">${suggestions}</div>
            </div>
            `
        : ""
      }
          </div>

          <div class="footer">
            <p>تم الإرسال من نظام إدارة التقييمات - Zyad Platform</p>
            <p>${new Date().toLocaleString("ar-EG", { timeZone: "Africa/Cairo" })}</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const data = await resend.emails.send({
      from: "Zyad Platform <onboarding@resend.dev>",
      to: ["messizeyad10@gmail.com"],
      subject: `📋 تقييم جديد - ${overallRating} نجوم`,
      html: htmlContent,
    });   

    return NextResponse.json(
      { message: "Feedback sent successfully", data },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error sending feedback:", error);
    return NextResponse.json(
      { error: "Failed to send feedback" },
      { status: 500 }
    );
  }
}   
  