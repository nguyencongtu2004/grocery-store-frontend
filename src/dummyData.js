export const DATA = {
  orders: [
    {
      _id: "1",
      orderDate: "2023-10-01",
      customer: {
        name: "John Doe",
        avatar: "https://example.com/avatar/johndoe.jpg",
        phone: "123-456-7890",
        email: "johndoe@example.com",
      },
      totalPrice: 100.5,
      status: "Delivered",
      paymentStatus: "Paid",
      products: [
        {
          _id: "6715c3d08677af3e2b06bd82",
          quantity: 2,
          name: "Brush",
          description:
            "High-quality cooking oil suitable for all types of cooking.",
          SKU: [
            {
              name: "Standard",
              classifications: ["500ml", "Plastic Bottle"],
              _id: "6715c3d08677af3e2b06bd83",
            },
            {
              name: "Premium",
              classifications: ["1L", "Glass Bottle"],
              _id: "6715c3d08677af3e2b06bd84",
            },
          ],
          price: 15,
          category: [
            {
              _id: "67152491a72ea6b2c8e0ae66",
              name: "Đồ gia dụng",
            },
          ],
          image: ["https://example.com/images/oil_a.jpg"],
        },
        {
          _id: "6715c3d08677af3e2b06bd85",
          quantity: 1,
          name: "Cooking Oil",
          description:
            "High-quality cooking oil suitable for all types of cooking.",
          SKU: [
            {
              name: "Standard",
              classifications: ["500ml", "Plastic Bottle"],
              _id: "6715c3d08677af3e2b06bd86",
            },
            {
              name: "Premium",
              classifications: ["1L", "Glass Bottle"],
              _id: "6715c3d08677af3e2b06bd87",
            },
          ],
          price: 5,
          category: [
            {
              _id: "67152491a72ea6b2c8e0ae66",
              name: "Đồ gia dụng",
            },
          ],
          image: ["https://example.com/images/oil_b.jpg"],
        },
      ],
    },
    {
      _id: "2",
      orderDate: "2023-10-02",
      customer: {
        name: "Jane Smith",
        avatar: "https://example.com/avatar/janesmith.jpg",
        phone: "987-654-3210",
        email: "janesmith@example.com",
      },
      totalPrice: 50.0,
      status: "Processing",
      paymentStatus: "Pending",
      products: [
        {
          _id: "6715c3d08677af3e2b06bd88",
          quantity: 3,
          name: "Shampoo",
          description: "Organic shampoo for all hair types.",
          SKU: [
            {
              name: "Standard",
              classifications: ["250ml", "Plastic Bottle"],
              _id: "6715c3d08677af3e2b06bd89",
            },
          ],
          price: 10,
          category: [
            {
              _id: "67152491a72ea6b2c8e0ae67",
              name: "Personal Care",
            },
          ],
          image: ["https://example.com/images/shampoo.jpg"],
        },
      ],
    },
    {
      _id: "3",
      orderDate: "2023-10-03",
      customer: {
        name: "Alice Johnson",
        avatar: "https://example.com/avatar/alicejohnson.jpg",
        phone: "555-123-4567",
        email: "alicejohnson@example.com",
      },
      totalPrice: 75.0,
      status: "Shipped",
      paymentStatus: "Paid",
      products: [
        {
          _id: "6715c3d08677af3e2b06bd90",
          quantity: 1,
          name: "Laptop",
          description: "High-performance laptop for gaming and work.",
          SKU: [
            {
              name: "Standard",
              classifications: ["16GB RAM", "512GB SSD"],
              _id: "6715c3d08677af3e2b06bd91",
            },
          ],
          price: 75,
          category: [
            {
              _id: "67152491a72ea6b2c8e0ae68",
              name: "Electronics",
            },
          ],
          image: ["https://example.com/images/laptop.jpg"],
        },
      ],
    },
  ],
  conversations: [
    {
      id: 1,
      name: "David Hello",
      lastMessage: "I cam across your profile and...",
      avatar: "/placeholder.svg?height=40&width=40",
      messages: [
        {
          id: 1,
          content:
            "Hello! I came across your profile and I'm impressed with your work.",
          sender: "David Hello",
          time: "10:30am",
        },
        {
          id: 2,
          content:
            "Thank you, David! I appreciate your kind words. How can I help you today?",
          sender: "Thắng Ngọt",
          time: "10:35am",
        },
        {
          id: 3,
          content:
            "I was wondering if we could discuss a potential collaboration on a project.",
          sender: "David Hello",
          time: "10:40am",
        },
      ],
    },
    {
      id: 2,
      name: "Henry Fisher",
      lastMessage: "I like your confidence 💪",
      avatar: "/placeholder.svg?height=40&width=40",
      messages: [
        {
          id: 1,
          content: "Hey Thắng, I really admire your confidence in your work!",
          sender: "Henry Fisher",
          time: "2:15pm",
        },
        {
          id: 2,
          content:
            "Thanks Henry! Confidence comes with experience and continuous learning.",
          sender: "Thắng Ngọt",
          time: "2:20pm",
        },
        {
          id: 3,
          content:
            "That's so true. Do you have any tips for building confidence in the tech industry?",
          sender: "Henry Fisher",
          time: "2:25pm",
        },
      ],
    },
    {
      id: 3,
      name: "Willum Smith",
      lastMessage: "Can you share your offer?",
      avatar: "/placeholder.svg?height=40&width=40",
      messages: [
        {
          id: 1,
          content:
            "Hi Thắng, I heard you have some great offers for web development services.",
          sender: "Willum Smith",
          time: "9:00am",
        },
        {
          id: 2,
          content:
            "Hello Willum! Yes, I do offer various web development services. What kind of project do you have in mind?",
          sender: "Thắng Ngọt",
          time: "9:05am",
        },
        {
          id: 3,
          content:
            "I'm looking to build an e-commerce site. Can you share your offer for that?",
          sender: "Willum Smith",
          time: "9:10am",
        },
      ],
    },
    {
      id: 4,
      name: "Henry Deco",
      lastMessage: "I'm waiting for you response!",
      avatar: "/placeholder.svg?height=40&width=40",
      messages: [
        {
          id: 1,
          content:
            "Thắng, I sent you a proposal last week. Have you had a chance to review it?",
          sender: "Henry Deco",
          time: "3:30pm",
        },
        {
          id: 2,
          content:
            "Hi Henry, I apologize for the delay. I'll take a look at it right away and get back to you.",
          sender: "Thắng Ngọt",
          time: "4:00pm",
        },
        {
          id: 3,
          content: "Thanks, I'm eagerly waiting for your response!",
          sender: "Henry Deco",
          time: "4:05pm",
        },
      ],
    },
    {
      id: 5,
      name: "Jubin Jack",
      lastMessage: "I'm waiting for you response!",
      avatar: "/placeholder.svg?height=40&width=40",
      messages: [
        {
          id: 1,
          content:
            "Hey Thắng, do you have any availability for a quick meeting this week?",
          sender: "Jubin Jack",
          time: "11:00am",
        },
        {
          id: 2,
          content:
            "Hi Jubin, I should be free on Thursday afternoon. Does that work for you?",
          sender: "Thắng Ngọt",
          time: "11:15am",
        },
        {
          id: 3,
          content:
            "Thursday sounds great! I'll send you a calendar invite. Thanks!",
          sender: "Jubin Jack",
          time: "11:20am",
        },
      ],
    },
  ],
};
