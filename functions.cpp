#include "functions.hpp"

string pickWord() {
    srand(time(0));
    int count = 0;
    int random = rand() % 5757;

    ifstream helper("5_letter_words.txt");
    if (!helper) {
        return "Failed, try again";
    }
    string word;

    while(helper >> word) {
        if (count == random) {
            return word;
        }
        count++;
    }
    return word;
}

bool GuessValid(char guess, vector<char> guessed_letters) {
    for (int i = 0; i < guessed_letters.size(); i++) {
      if (guessed_letters[i] == guess) {
        return false;
      }
    }
    return true;
  }
  
 
  string GetBlankWord(unsigned int size) {
    string helper;
  
    for (unsigned int i = 0; i < size; i++) {
      helper.push_back('-');
    }
  
    return helper;
  }
  

  bool WordCompleted(const string& word) {
    for (long i = 0; i < word.size(); i++) {
      if (word[i] == '-') {
        return false;
      }
    }
    return true;
  }
  
  
  string PrintState(const string& mystery_word_so_far, unsigned int misses) {
    string x = "--- Current State --- \n " "You have "; 
    
    x += 6 - misses;
    x += " lives left. \n";
    x += "Word: ";
    for (unsigned int i = 0; i < mystery_word_so_far.length(); i++) {
      x+= mystery_word_so_far[i];
      x+= " ";
    }
    return x;
  }
  
  
  
 
  char GetNextGuess(const vector<char>& guessed_letters) {
    cout << "What is your next guess? ";
    char x;
  
    while (!(cin >> x) || !GuessValid(x, guessed_letters) || !isalpha(x) ||
           isupper(x)) {
      cout << endl;
      cout << "Invalid guess. Please enter a lowercase letter that you have "
           << "not guessed yet : ";
    }
  
    return x;
  }
  

  bool CheckWordForGuess(string& word_so_far, string word, char guess) {
    bool helper = false;
    for (long i = 0; i < word.size(); i++) {
      if (word[i] == guess) {
        word_so_far[i] = guess;
        helper = true;
      }
    }
    return helper;
  }
  
  
  string GuessFeedback(bool correct_guess, char guess) {
    string x = "The letter ";
    x += guess;
    if (correct_guess) {
      x += " is in the word!";
    } else {
      x += " is not in the word.";
    }
    return x;
  }
  
  
  bool CheckEndConditions(const string& word_so_far,
                          unsigned int misses,
                          const string& solution) {
    bool helper = WordCompleted(word_so_far);
    if (helper) {
      return true;
    }
  
    if (misses == 6) {
      return true;
    }
  
    return false;
}