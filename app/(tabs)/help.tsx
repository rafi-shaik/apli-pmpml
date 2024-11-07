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
import { SafeAreaView } from "react-native-safe-area-context";
import AntDesign from "@expo/vector-icons/AntDesign";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");
const TAB_BAR_HEIGHT = 60;
const BUTTON_CONTAINER_HEIGHT = 100;

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQSection {
  title: string;
  items: FAQItem[];
}

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
      { question: "What is the frequency of location updates?", answer: "" },
      { question: "Why is no bus showing on the app in my area?", answer: "" },
    ],
  },
  {
    title: "Pass",
    items: [
      { question: "Can I book a pass in advance?", answer: "" },
      {
        question:
          "My transaction is completed, but the pass is still showing as pending. What should I do?",
        answer: "",
      },
      {
        question:
          "It has been 3 minutes, and the pass is still showing as pending. What now?",
        answer: "",
      },
      {
        question: "A pass older than 1 day is still showing as pending.",
        answer: "",
      },
      {
        question:
          "How can I confirm if I received a refund for my pending pass?",
        answer: "",
      },
    ],
  },
  {
    title: "Tickets",
    items: [
      { question: "What is the validity of a ticket?", answer: "" },
      { question: "Can I book a ticket in advance?", answer: "" },
      {
        question:
          "My transaction is completed, but the ticket is still showing as pending. What should I do?",
        answer: "",
      },
      {
        question:
          "It has been 3 minutes, and the ticket is still showing as pending.",
        answer: "",
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
          <AntDesign name="minuscircle" size={18} color="red" />
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
    <SafeAreaView style={styles.container}>
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
        <CustomButton onPress={() => {}}>Raise New Complaint</CustomButton>
      </View>
    </SafeAreaView>
  );
};

export default ComplaintsPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingHorizontal: 15,
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
    fontWeight: 700,
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
    fontWeight: 700,
    paddingRight: 30,
    lineHeight:20
  },

  questionText: {
    fontSize: 16,
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
    // borderTopWidth: 1,
    // borderTopColor: "#f0f0f0",
  },
  buttonText: {
    textAlign: "center",
    color: "#000000",
    fontSize: 14,
    marginBottom: 8,
  },
});
