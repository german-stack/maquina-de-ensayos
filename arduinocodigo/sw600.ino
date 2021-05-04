#include <Adafruit_ADS1X15.h>
#include <PID_v1.h>


int pinmotor=8;
int pinele1=2;
int pinele2=3;
int pindesbloqueo=7;
int pinpresion=4;
int pinservo1=5;
int pinservo2=6;

const int CLOCK_PIN = 10;
const int DATA_PIN = 9;
const int BIT_COUNT = 23;

Adafruit_ADS1115 ads;
const float multiplier = 0.1875F;
const int numReadings = 20; //
int16_t readings[numReadings];     
int readIndex = 0;             
int16_t total = 0;                 
int16_t fuerza = 0;  


// còdigo para verificar el tiempo de muestreo 
volatile unsigned muestreoActual = 0;                     // variables para definiciòn del tiempo de muestreo
volatile unsigned muestreoAnterior = 0;
volatile unsigned deltaMuestreo = 0;

int k = 1000; 
int control = 0;
int piston = 0;
byte envia=0;
volatile float PosicionActual=0;   
volatile float PosAnt = 0;
volatile int16_t fuerzaAnt = 0;
volatile float tiempo=0;
volatile float  velocidad=0;



double Kp=10, Ki=2, Kd=0.2;
// variables externas del controlador
double Input, Output, Setpoint;
PID pidController(&Input, &Output, &Setpoint, Kp, Ki, Kd, DIRECT);


String dato;
volatile float Pinicial=0;
volatile float Finicial=0;


float y=0.0;
float  alpha=0.05;
float  S=y;


void setup() 
{
 Serial.begin(9600);
 pinMode(pinmotor,OUTPUT);
 pinMode(pinele1,OUTPUT);
 pinMode(pinele2,OUTPUT);
 pinMode(pindesbloqueo,OUTPUT);
 pinMode(pinpresion,OUTPUT);
 pinMode(pinservo1,OUTPUT);
 pinMode(pinservo1,OUTPUT);
 digitalWrite(pinmotor,HIGH);
 digitalWrite(pinele1,HIGH);
 digitalWrite(pinele2,HIGH);
 digitalWrite(pindesbloqueo,HIGH);
 digitalWrite(pinpresion,HIGH);
 analogWrite(pinservo1,0);
 analogWrite(pinservo2,0);
  //setup our pins
  pinMode(DATA_PIN, INPUT);
  pinMode(CLOCK_PIN, OUTPUT);

  //give some default values
  digitalWrite(CLOCK_PIN, HIGH);


  // Iniciar el ADS1115
  ads.begin();
 
  
  

  
  
  Input =0;
  Setpoint =15;
  pidController.SetMode(AUTOMATIC);     // encender el PI
  
}

void loop() {

  


 
  muestreoActual = millis();

  
  PosicionActual = abs(((readPosition()/1000)*2)-Pinicial);
  int ventana = abs(PosicionActual-PosAnt);
  if(ventana>=10){ PosicionActual =PosAnt;}else{PosAnt= PosicionActual;}
  y=(float)ads.readADC_SingleEnded(0)*multiplier-Finicial;
  S=(alpha*y)+((1-alpha)*S);

  deltaMuestreo =(double) muestreoActual - muestreoAnterior;     // delta de muestreo 
 
  if ( deltaMuestreo >= k)                                       // se asegura el tiempo de muestreo
    {
       
       
       
       if(envia==1){//--adquisicion de datos---//
//                 PosicionActual = readPosition();
//                 fuerza=ads.readADC_SingleEnded(0)*multiplier;
//                 int ventana = abs(fuerza-fuerzaAnt);
//                 if(ventana>=1){ fuerza=fuerza-Finicial;}else{fuerza=fuerzaAnt;}
//                 if(PosicionActual != -1.0){
//                            PosicionActual = abs( PosicionActual-Pinicial);  
//                            PosicionActual =(PosicionActual/1000)*2;}else{PosicionActual=PosAnt;}


                tiempo =(float) deltaMuestreo/1000;   //para el calculo de la velocidad en segundos
                if (control ==1){
                float deltaFuerza = (float)fuerza-fuerzaAnt;  
                velocidad = deltaFuerza/tiempo;                   // cambio de  fuerza  en segundo}
                }

                if (control ==2){
                float deltaPos =(float)PosAnt - PosicionActual; // cambio de  posicion en minutos
                velocidad = (deltaPos/tiempo)*60;   
                }


                  
                 //--------Se actualiza el PID---//  
                    //piston central baja 
                if(piston==1 && control !=0){
      
                    Input = velocidad;
                    pidController.Compute();        
                    analogWrite(pinservo1,0);
                    analogWrite(pinservo2, Output);
                    }
                     //piston central  sube
                   if(piston==2 && control !=0){
                
                      Input = velocidad;
                      pidController.Compute();
                      analogWrite(pinservo2, 0);
                      analogWrite(pinservo1, Output);}  
                  }
                             
                        //-----------------------datos por serial--------------//
              Serial.print(S);
              Serial.print(',');
              Serial.print(PosicionActual);
              Serial.print(',');
              Serial.print(velocidad);
              Serial.print(',');
              Serial.print(control);
              Serial.print(',');
              Serial.print(piston);
              Serial.print(',');
              Serial.print(Setpoint);
              Serial.print(',');
              Serial.print(Input);
              Serial.print(',');
              Serial.println(Output);
              //----------------------------------//  
      muestreoAnterior = muestreoActual;
      PosAnt = PosicionActual;
      fuerzaAnt =fuerza;
    }
    
    if (Serial.available()){
          
        
          dato=Serial.readString();

           if(dato[0]=='a'){ digitalWrite(pinmotor,LOW);} // motor  on

           if(dato[0]=='b'){ digitalWrite(pinmotor,HIGH);}// motor off
        
          
           if(dato[0]=='c') //pistones laterales suben
           {    
            digitalWrite(pinele1,HIGH);
            delay(10);
            digitalWrite(pinele2,LOW);
            digitalWrite(pindesbloqueo,LOW);
            delay(10);
            digitalWrite(pinpresion,LOW);
            control=0;
            piston=0;
           }

           if(dato[0]=='d')//pistones laterales bajan
           { 
            digitalWrite(pinele2,HIGH);
            delay(10);
            digitalWrite(pinele1,LOW);
            digitalWrite(pindesbloqueo,LOW);
            delay(10);
            digitalWrite(pinpresion,LOW);
            control=0;
            piston=0;
           }


           if(dato[0]=='e')//detener pistones
           { 
            digitalWrite(pinele1,HIGH);
            digitalWrite(pinele2,HIGH);
            digitalWrite(pindesbloqueo,HIGH);
            digitalWrite(pinpresion,HIGH);
            analogWrite(pinservo1,0);
            analogWrite(pinservo2,0);
            control=0;
            piston=0;
            envia=0;
           }

           if(dato[0]=='f')//asigna   para que el piston central suba
           { 
            
            
            digitalWrite(pinele1,HIGH);
            digitalWrite(pinele2,HIGH);
            digitalWrite(pindesbloqueo,HIGH);
            piston=1;
            analogWrite(pinservo1,0);
            analogWrite(pinservo2, 100);
            digitalWrite(pinpresion,LOW);
            delay(100);
            Pinicial = (readPosition()/1000)*2;
//            while(Pinicial==-1.0){Pinicial=readPosition();
//             }
            Finicial = ads.readADC_SingleEnded(0)*multiplier;
            envia=1;
            } 
           
           if(dato[0]=='g')// asigna  para que el piston central baje
           { 
            
            
            digitalWrite(pinele1,HIGH);
            digitalWrite(pinele2,HIGH);
            digitalWrite(pindesbloqueo,HIGH);
            piston=2;
            analogWrite(pinservo2, 0);
            analogWrite(pinservo1, 100);
            digitalWrite(pinpresion,LOW);
            delay(100);
            Pinicial = (readPosition()/1000)*2;
//            while(Pinicial==-1.0){Pinicial=readPosition();
//             }
            Finicial = ads.readADC_SingleEnded(0)*multiplier;
            envia=1;
           }

           if(dato[0]=='h')//recibe dato para el control por celda
           { 
            control=1;
           }
            if(dato[0]=='i')//recibe dato para el control por lvdt
           { 
            control=2;
           }

           if(dato[0]=='j')//recibe dato  de  velocidad para el setpoint
           { 
            dato=dato.substring(1);
            Setpoint =dato.toDouble();
            }

           if(dato[0]=='k') //recibe dato  para  la constante KP  del pid
           { 
            dato=dato.substring(1);
            Kp=dato.toDouble();
            pidController.SetTunings(Kp, Ki, Kd); // actualiza constantes  del pid
           }

           if(dato[0]=='l')//recibe dato  para  la constante KI  del pid
           { 
            dato=dato.substring(1);
            Ki=dato.toDouble();
            pidController.SetTunings(Kp, Ki, Kd);
           }

            if(dato[0]=='m')//recibe dato  para  la constante KD  del pid
           { 
            dato=dato.substring(1);
            Kd=dato.toDouble();
            pidController.SetTunings(Kp, Ki, Kd);
           }
          }

    }


float readPosition() {
  // Read the same position data twice to check for errors
  unsigned long sample1 = shiftIn(DATA_PIN, CLOCK_PIN, BIT_COUNT);
//  unsigned long sample2 = shiftIn(DATA_PIN, CLOCK_PIN, BIT_COUNT);
  delayMicroseconds(25);  // Clock mus be high for 20 microseconds before a new sample can be taken
//
// 
// if (sample1 != sample2)
//    return -1.0;
  return sample1;
}


//read in a byte of data from the digital input of the board.
unsigned long shiftIn(const int data_pin, const int clock_pin, const int bit_count) {
  unsigned long data = 0;
 

  for (int i=0; i<bit_count; i++) {
    data <<= 1;
    digitalWrite(clock_pin,LOW);
    delayMicroseconds(1);
    digitalWrite(clock_pin,HIGH);
    delayMicroseconds(1);

    data |= digitalRead(data_pin);
  }

    unsigned long res=data;
    while (data > 0)
    {
        data >>= 1;
        res ^= data;
    }
    return res;
  }









//  float AverageTemperature = 0;
//  int MeasurementsToAverage = 16;
//  for(int i = 0; i < MeasurementsToAverage; ++i)
//  {
//    AverageTemperature += MeasureTemperature();
//    delay(1);
//  }
//  AverageTemperature /= MeasurementsToAverage;
