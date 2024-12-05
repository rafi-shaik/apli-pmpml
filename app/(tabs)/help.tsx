import {
  Dimensions,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useState } from "react";
import CustomButton from "@/components/CustomButton";
import AntDesign from "@expo/vector-icons/AntDesign";
import { FAQSection } from "@/types";

const TAB_BAR_HEIGHT = 60;
const BUTTON_CONTAINER_HEIGHT = 100;

const faqData: FAQSection[] = [
  {
    title: "General",
    items: [
      {
        question: "I an unable to verify my phone number.",
        answer:
          "Phone number verification is not required to use the app at this time",
      },
    ],
  },
  {
    title: "Bus",
    items: [
      {
        question: "How many buses are trackable?",
        answer:
          "Currently, 1200 buses are trackable in the Apli PMPML app. Additional buses are being added daily and all buses will be trackable soon",
      },
      {
        question: "What is the frequency of location updates?",
        answer: "Location updates occur every 10 to 30 seconds.",
      },
      {
        question: "Why is no bus showing on the app in my area?",
        answer:
          "The buses in your area might not have GPS devices configured yet. They will be configured soon, and buses will then be visible in the app.",
      },
    ],
  },
  {
    title: "Pass",
    items: [
      {
        question: "Can I book a pass in advance?",
        answer: "Yes, passes can be generated in advance.",
      },
      {
        question:
          "My transaction is completed, but the pass is still showing as pending. What should I do?",
        answer:
          "Due to payment delays, passes may take up to 3 minutes to generate. Please wait for 3 minutes before attempting to book a new pass.",
      },
      {
        question:
          "It has been 3 minutes, and the pass is still showing as pending. What now?",
        answer:
          "If the pass is still pending after 3 minutes, please purchase a new pass either online or from the conductor. If the previous payment was debited, it will be refunded to your bank account within 24-48 hours.",
      },
      {
        question: "A pass older than 1 day is still showing as pending.",
        answer:
          "This pass has been refunded. Please check your bank statement for the refund.",
      },
      {
        question:
          "How can I confirm if I received a refund for my pending pass?",
        answer:
          "Refunds are automatically processed within 24-48 hours if the pass was not generated. Please check your bank account statement to verify the refund.",
      },
      {
        question: "What is the validity of a ticket?",
        answer: "The answer to this question is not provided in the image.",
      },
    ],
  },
  {
    title: "Tickets",
    items: [
      {
        question: "What is the validity of a ticket?",
        answer:
          "Ticket validity is based on the fare amount:\n- Up to ₹15: Valid for 30 minutes\n- ₹25: Valid for 60 minutes\n- ₹45: Valid for 120 minutes\n- ₹65: Valid for 180 minutes",
      },
      {
        question: "Can I book a ticket in advance?",
        answer:
          "No, tickets are activated immediately upon purchase. Advance ticket booking is not available.",
      },
      {
        question:
          "My transaction is completed, but the ticket is still showing as pending. What should I do?",
        answer:
          "Due to payment delays, tickets may take up to 3 minutes to generate. Please wait for 3 minutes before attempting to book a new ticket.",
      },
      {
        question:
          "It has been 3 minutes, and the ticket is still showing as pending. What now?",
        answer:
          "If the ticket is still pending after 3 minutes, please purchase a new ticket either online or from the conductor. If the previous payment was debited, it will be refunded to your bank account within 24-48 hours.",
      },
      {
        question: "A ticket older than 1 day is still showing as pending.",
        answer:
          "This ticket has been refunded. Please check your bank statement for the refund.",
      },
      {
        question:
          "How can I confirm if I received a refund for my pending ticket?",
        answer:
          "Refunds are automatically processed within 24-48 hours if the ticket was not generated. Please check your bank account statement to verify the refund.",
      },
    ],
  },
];

const FAQItem = ({
  question,
  answer,
}: {
  question: string;
  answer: string;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <View style={styles.faqItem}>
      <Pressable
        style={styles.questionContainer}
        onPress={() => setIsExpanded(!isExpanded)}
      >
        <Text style={styles.questionText}>• {question}</Text>
        {isExpanded ? (
          <AntDesign name="minuscircle" size={18} color="#c4443b" />
        ) : (
          <AntDesign name="pluscircle" size={18} color="#666666" />
        )}
      </Pressable>
      {isExpanded && <Text style={styles.answerText}>- {answer}</Text>}
    </View>
  );
};

const ComplaintsPage = () => {
  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {faqData.map((section, sectionIndex) => (
          <View key={sectionIndex} style={styles.section}>
            {section.title && (
              <Text style={styles.sectionTitle}>{section.title}</Text>
            )}
            {section.items.map((item, itemIndex) => (
              <FAQItem
                key={itemIndex}
                question={item.question}
                answer={item.answer}
              />
            ))}
          </View>
        ))}
      </ScrollView>

      <View style={styles.buttonContainer}>
        <Text style={styles.buttonText}>
          Can't find what you're looking for?
        </Text>
        <CustomButton
          onPress={() => {}}
          buttonBgColor="#219652"
          buttonTextStyles={{ color: "white", fontSize: 18, fontWeight: "500" }}
        >
          Raise New Complaint
        </CustomButton>
      </View>
    </View>
  );
};

export default ComplaintsPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingHorizontal: 15,
    paddingTop: 10,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: BUTTON_CONTAINER_HEIGHT + TAB_BAR_HEIGHT,
  },
  section: {
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    marginBottom: 10,
    paddingBottom: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#8BC34A",
  },
  faqItem: {
    gap: 3,
    marginBottom: 10,
  },
  questionContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingRight: 5,
  },
  answerText: {
    fontSize: 14,
    color: "black",
    fontWeight: "700",
    paddingRight: 30,
    lineHeight: 20,
  },
  questionText: {
    fontSize: 17,
    color: "black",
    flex: 1,
    paddingRight: 10,
  },
  buttonContainer: {
    position: "absolute",
    bottom: TAB_BAR_HEIGHT,
    left: 0,
    right: 0,
    backgroundColor: "white",
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  buttonText: {
    textAlign: "center",
    color: "#000000",
    fontSize: 15,
    marginBottom: 8,
    fontWeight: "500",
  },
});
