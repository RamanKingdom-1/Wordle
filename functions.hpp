#pragma once
#include <iostream>
#include <vector>
#include <ctime> 
#include <fstream>

using namespace std;


string PickWord();


bool GuessValid(char guess, vector<char> guessed_letters);


string GetBlankWord(unsigned int size);


bool WordCompleted(const string& word);


string PrintState(const string& mystery_word_so_far, unsigned int misses);


char GetNextGuess(const vector<char>& guessed_letters);


bool CheckWordForGuess(string& word_so_far, string word, char guess);


string GuessFeedback(bool correct_guess, char guess);


bool CheckEndConditions(const string& word_so_far,
                        unsigned int misses,
                        const string& solution);