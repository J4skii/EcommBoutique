import { Resend } from "resend"
import { supabase } from "./database"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendOrderConfirmationEmail(orderId: string) {
  try {
    // Get order details
    const { data: order, error } = await supabase
      .from("orders")
      .select(`
        *,
        order_items (
          *,
          products (name, image_url)
        )
      `)
      .eq("id", orderId)
      .single()

    if (error || !order) {
      throw new Error("Order not found")
    }

    const customerName =
      `${order.billing_address?.first_name || ""} ${order.billing_address?.last_name || ""}`.trim() || "Valued Customer"

    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Order Confirmation - Paitons Boutique</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #ec4899, #8b5cf6); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
            .order-item { display: flex; align-items: center; padding: 15px; border-bottom: 1px solid #e5e7eb; }
            .order-item img { width: 60px; height: 60px; object-fit: cover; border-radius: 8px; margin-right: 15px; }
            .total { background: #fff; padding: 20px; border-radius: 8px; margin-top: 20px; }
            .footer { text-align: center; margin-top: 30px; color: #6b7280; }
            .button { display: inline-block; background: #ec4899; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>✨ Thank You for Your Order!</h1>
              <p>Order #${order.order_number}</p>
            </div>
            
            <div class="content">
              <p>Dear ${customerName},</p>
              
              <p>Thank you for choosing Paitons Boutique! Your order has been confirmed and Paiton is excited to prepare your beautiful handcrafted bows.</p>
              
              <h3>Order Details:</h3>
              ${
                order.order_items
                  ?.map(
                    (item: any) => `
                <div class="order-item">
                  <img src="${item.products?.image_url || "/placeholder.svg"}" alt="${item.product_name}">
                  <div>
                    <strong>${item.product_name}</strong><br>
                    ${item.selected_color ? `Color: ${item.selected_color}<br>` : ""}
                    ${item.selected_size ? `Size: ${item.selected_size}<br>` : ""}
                    Quantity: ${item.quantity} × R${item.unit_price} = R${item.total_price}
                  </div>
                </div>
              `,
                  )
                  .join("") || ""
              }
              
              <div class="total">
                <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                  <span>Subtotal:</span>
                  <span>R${order.subtotal}</span>
                </div>
                ${
                  order.shipping_cost > 0
                    ? `
                <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                  <span>Shipping:</span>
                  <span>R${order.shipping_cost}</span>
                </div>
                `
                    : ""
                }
                ${
                  order.discount_amount > 0
                    ? `
                <div style="display: flex; justify-content: space-between; margin-bottom: 10px; color: #059669;">
                  <span>Discount:</span>
                  <span>-R${order.discount_amount}</span>
                </div>
                `
                    : ""
                }
                <div style="display: flex; justify-content: space-between; font-size: 18px; font-weight: bold; border-top: 2px solid #ec4899; padding-top: 10px;">
                  <span>Total:</span>
                  <span>R${order.total_amount}</span>
                </div>
              </div>
              
              <h3>What's Next?</h3>
              <p>Paiton will begin crafting your order within 1-2 business days. Each bow is handmade with love and attention to detail, so please allow 5-7 business days for completion.</p>
              
              <p>You'll receive another email with tracking information once your order ships.</p>
              
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/orders/${order.order_number}" class="button">Track Your Order</a>
              
              <p>If you have any questions, feel free to contact Paiton directly:</p>
              <ul>
                <li>📧 hello@paitonsboutique.co.za</li>
                <li>📱 +27 123 456 789 (WhatsApp)</li>
              </ul>
            </div>
            
            <div class="footer">
              <p>With love from Durban, KZN ❤️<br>
              Paitons Boutique</p>
            </div>
          </div>
        </body>
      </html>
    `

    await resend.emails.send({
      from: "Paitons Boutique <orders@paitonsboutique.co.za>",
      to: [order.customer_email],
      subject: `Order Confirmation #${order.order_number} - Paitons Boutique`,
      html: emailHtml,
    })

    // Send notification to Paiton
    await resend.emails.send({
      from: "Paitons Boutique <orders@paitonsboutique.co.za>",
      to: ["paiton@paitonsboutique.co.za"],
      subject: `New Order #${order.order_number}`,
      html: `
        <h2>New Order Received!</h2>
        <p><strong>Order:</strong> #${order.order_number}</p>
        <p><strong>Customer:</strong> ${customerName} (${order.customer_email})</p>
        <p><strong>Total:</strong> R${order.total_amount}</p>
        <p><strong>Items:</strong> ${order.order_items?.length || 0}</p>
        <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/admin">View in Admin Dashboard</a></p>
      `,
    })

    console.log(`Order confirmation email sent for order ${order.order_number}`)
  } catch (error) {
    console.error("Failed to send order confirmation email:", error)
    throw error
  }
}

export async function sendCustomOrderNotification(customOrderId: string) {
  try {
    const { data: customOrder, error } = await supabase
      .from("custom_order_requests")
      .select("*")
      .eq("id", customOrderId)
      .single()

    if (error || !customOrder) {
      throw new Error("Custom order not found")
    }

    // Send notification to Paiton
    await resend.emails.send({
      from: "Paitons Boutique <orders@paitonsboutique.co.za>",
      to: ["paiton@paitonsboutique.co.za"],
      subject: `New Custom Order Request from ${customOrder.customer_name}`,
      html: `
        <h2>New Custom Order Request!</h2>
        <p><strong>Customer:</strong> ${customOrder.customer_name}</p>
        <p><strong>Email:</strong> ${customOrder.customer_email}</p>
        <p><strong>Phone:</strong> ${customOrder.customer_phone || "Not provided"}</p>
        <p><strong>Colors:</strong> ${customOrder.colors.join(", ")}</p>
        <p><strong>Size:</strong> ${customOrder.size}</p>
        <p><strong>Quantity:</strong> ${customOrder.quantity}</p>
        <p><strong>Rush Order:</strong> ${customOrder.is_rush_order ? "Yes (+R50)" : "No"}</p>
        <p><strong>Estimated Price:</strong> R${customOrder.estimated_price}</p>
        ${customOrder.special_requests ? `<p><strong>Special Requests:</strong><br>${customOrder.special_requests}</p>` : ""}
        <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/admin">View in Admin Dashboard</a></p>
      `,
    })

    // Send confirmation to customer
    await resend.emails.send({
      from: "Paitons Boutique <orders@paitonsboutique.co.za>",
      to: [customOrder.customer_email],
      subject: "Custom Order Request Received - Paitons Boutique",
      html: `
        <h2>Thank you for your custom order request!</h2>
        <p>Dear ${customOrder.customer_name},</p>
        <p>Paiton has received your custom bow request and will contact you within 24 hours to discuss the details and provide a final quote.</p>
        <p><strong>Your Request Details:</strong></p>
        <ul>
          <li>Colors: ${customOrder.colors.join(", ")}</li>
          <li>Size: ${customOrder.size}</li>
          <li>Quantity: ${customOrder.quantity}</li>
          <li>Estimated Price: R${customOrder.estimated_price}</li>
        </ul>
        <p>Paiton will be in touch soon!</p>
        <p>Best regards,<br>Paitons Boutique</p>
      `,
    })

    console.log(`Custom order notification sent for request ${customOrderId}`)
  } catch (error) {
    console.error("Failed to send custom order notification:", error)
    throw error
  }
}

export async function sendNewsletterWelcome(email: string, firstName?: string) {
  try {
    await resend.emails.send({
      from: "Paitons Boutique <hello@paitonsboutique.co.za>",
      to: [email],
      subject: "Welcome to Paitons Boutique Family! ✨",
      html: `
        <h2>Welcome ${firstName || "Beautiful"}!</h2>
        <p>Thank you for joining the Paitons Boutique family! You'll be the first to know about:</p>
        <ul>
          <li>✨ New bow collections</li>
          <li>🎉 Exclusive discounts</li>
          <li>📸 Behind-the-scenes crafting stories</li>
          <li>💝 Special offers just for subscribers</li>
        </ul>
        <p>As a welcome gift, use code <strong>WELCOME10</strong> for 10% off your first order!</p>
        <p>With love from Durban,<br>Paiton ❤️</p>
      `,
    })
  } catch (error) {
    console.error("Failed to send welcome email:", error)
  }
}
