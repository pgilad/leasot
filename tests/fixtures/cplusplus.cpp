// TODO: document file operations
#include <iostream>
#include <fstream>
using namespace std;

int main () {
  ofstream myfile;
  myfile.open ("example.txt");
  myfile << "Writing this to a file.\n";
  /* FIXME: make sure file can be closed */
  myfile.close();
  return 0;
}
