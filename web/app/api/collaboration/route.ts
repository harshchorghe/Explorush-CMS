import { NextResponse } from "next/server";
import { sanityWriteClient } from "@/lib/sanityWrite";
import { sendEmail } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, company, email, phone, collabType, budget, details, links } = body;

    // Validation
    if (!name || !company || !email || !details) {
      return NextResponse.json(
        { success: false, error: "Missing required fields (Name, Company, Email, Details)" },
        { status: 400 }
      );
    }

    // Create the document in Sanity
    const collabDoc = {
      _type: "collaboration",
      name,
      company,
      email,
      phone: phone || "",
      collabType: collabType || "other",
      budget: budget || "flexible",
      details,
      links: links || "",
      status: "new",
    };

    const result = await sanityWriteClient.create(collabDoc);

    // Formatted labels for emails
    const collabTypeLabels: Record<string, string> = {
      brand_sponsorship: "Brand Sponsorship",
      destination_marketing: "Destination Marketing",
      hotel_resort_review: "Hotel/Resort Review",
      content_creation: "Content Creation",
      group_trip_partnership: "Group Trip Partnership",
      other: "Other",
    };

    const budgetLabels: Record<string, string> = {
      under_1k: "Under ₹1,000",
      "1k_5k": "₹1,000 - ₹5,000",
      "5k_10k": "₹5,000 - ₹10,000",
      "10k_plus": "₹10,000+",
      flexible: "Flexible / Contact Us",
    };

    const prettyCollabType = collabTypeLabels[collabType] || collabType || "Other";
    const prettyBudget = budgetLabels[budget] || budget || "Flexible / Contact Us";

    // 1. Send admin notification email
    const adminEmail = process.env.ADMIN_EMAIL || "admin@explorush.com";
    const adminEmailHtml = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #1F4B43; border-radius: 10px; background-color: #F8F4EC;">
        <h2 style="color: #1F4B43; border-bottom: 2px solid #D8B47A; padding-bottom: 10px; font-family: Georgia, serif;">
          New Collaboration Request Received
        </h2>
        <p style="font-size: 14px; color: #2A2A2A;">
          A new collaboration request has been submitted on the Explorush landing page. Details are logged below:
        </p>
        
        <table style="width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 14px; color: #2A2A2A;">
          <tr>
            <td style="padding: 8px; font-weight: bold; width: 35%; border-bottom: 1px solid #1F4B43/10;">Full Name:</td>
            <td style="padding: 8px; border-bottom: 1px solid #1F4B43/10;">${name}</td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #1F4B43/10;">Company / Brand:</td>
            <td style="padding: 8px; border-bottom: 1px solid #1F4B43/10;">${company}</td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #1F4B43/10;">Email:</td>
            <td style="padding: 8px; border-bottom: 1px solid #1F4B43/10;"><a href="mailto:${email}" style="color: #4F7A68; text-decoration: none; font-weight: bold;">${email}</a></td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #1F4B43/10;">Phone:</td>
            <td style="padding: 8px; border-bottom: 1px solid #1F4B43/10;">${phone || "Not Provided"}</td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #1F4B43/10;">Collaboration Type:</td>
            <td style="padding: 8px; border-bottom: 1px solid #1F4B43/10;">${prettyCollabType}</td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #1F4B43/10;">Budget Range:</td>
            <td style="padding: 8px; border-bottom: 1px solid #1F4B43/10;">${prettyBudget}</td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #1F4B43/10;">Web/Social Links:</td>
            <td style="padding: 8px; border-bottom: 1px solid #1F4B43/10;">${links ? `<a href="${links}" target="_blank" style="color: #4F7A68;">${links}</a>` : "Not Provided"}</td>
          </tr>
        </table>
        
        <div style="margin-top: 20px; padding: 15px; background-color: #ffffff; border-radius: 8px; border-left: 4px solid #D8B47A;">
          <h4 style="margin: 0 0 10px 0; color: #1F4B43;">Campaign / Collaboration Details:</h4>
          <p style="margin: 0; font-size: 13px; line-height: 1.6; color: #2A2A2A; white-space: pre-wrap;">${details}</p>
        </div>
        
        <div style="margin-top: 30px; text-align: center;">
          <a href="${req.headers.get("origin") || ""}/admin" style="background-color: #1F4B43; color: #F8F4EC; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 14px; display: inline-block;">
            Manage Requests in Admin Panel
          </a>
        </div>
      </div>
    `;

    await sendEmail({
      to: adminEmail,
      subject: `[Collab Request] ${name} from ${company}`,
      html: adminEmailHtml,
    });

    // 2. Send user confirmation email
    const userEmailHtml = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #1F4B43; border-radius: 10px; background-color: #F8F4EC;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h1 style="color: #1F4B43; font-family: Georgia, serif; margin: 0;">EXPLORUSH</h1>
          <p style="color: #D8B47A; font-size: 12px; text-transform: uppercase; letter-spacing: 2px; margin: 5px 0 0 0; font-weight: bold;">Travel & Technology</p>
        </div>
        
        <h2 style="color: #1F4B43; border-bottom: 2px solid #D8B47A; padding-bottom: 10px; font-family: Georgia, serif; font-size: 20px;">
          Hi ${name},
        </h2>
        
        <p style="font-size: 14px; line-height: 1.6; color: #2A2A2A;">
          Thank you for reaching out to collaborate with **Explorush**! We have successfully received your proposal.
        </p>
        
        <p style="font-size: 14px; line-height: 1.6; color: #2A2A2A;">
          Harsh and the Explorush team are excited to review your campaign ideas. We'll examine your website/social links and details to see how we can create an unforgettable, premium story together. We typically respond within **24 to 48 hours**.
        </p>
        
        <div style="margin-top: 25px; padding: 15px; background-color: #ffffff; border-radius: 8px; border: 1px solid #1F4B43/10;">
          <h4 style="margin: 0 0 10px 0; color: #1F4B43; font-family: Georgia, serif;">Submission Overview:</h4>
          <ul style="margin: 0; padding-left: 20px; font-size: 13px; color: #2A2A2A; line-height: 1.8;">
            <li><strong>Company/Brand:</strong> ${company}</li>
            <li><strong>Collaboration Type:</strong> ${prettyCollabType}</li>
            <li><strong>Budget range:</strong> ${prettyBudget}</li>
          </ul>
        </div>
        
        <p style="font-size: 13px; color: #charcoal/60; margin-top: 30px; text-align: center; font-style: italic;">
          "Let's explore the world, one journey at a time."
        </p>
        
        <hr style="border: 0; border-top: 1px solid #1F4B43/10; margin: 20px 0;" />
        
        <div style="text-align: center; font-size: 11px; color: #2A2A2A/60;">
          &copy; ${new Date().getFullYear()} Explorush. All rights reserved. <br />
          This is an automated confirmation of your request.
        </div>
      </div>
    `;

    await sendEmail({
      to: email,
      subject: `Explorush Collaboration Request - Received!`,
      html: userEmailHtml,
    });

    return NextResponse.json({
      success: true,
      collabId: result._id,
    });
  } catch (error: any) {
    console.error("Collaboration API error:", error);
    return NextResponse.json(
      { success: false, error: error.message || error },
      { status: 500 }
    );
  }
}
