#!/usr/bin/env python
# coding: utf-8

# In[1]:

import sys
import pandas as pd
import re

filename = "./_python/PT seadmete taotlusvoor 2014-2021.xlsx"
taotlusvoor = pd.read_excel(filename, header=4)

# In[4]:

#taotlusvoor.tail()


# In[5]:


tags = {
    "LEGO": {
        "EV3": {
            "Education": {
                "total": 0
            },
            "total": 0
        },
        "WeDo": {
            2.0: {
                "total": 0
            },
            "total": 0
        },
        "SPIKE": {
            "Prime": {
                "total": 0
            },
            "total": 0
        },
        "total": 0
    },
    "EV3": {
        "total": 0
    },
    "WeDo": {
        "total": 0
    },
    "LME": {
        "total": 0
    },
    "Ozobot": {
        "Evo": {
            "total": 0
        },
        "total": 0
    },
    "Qobo": {
        "total": 0
    },
    "Makeblock": {
        "total": 0
    },
    "Dash": {
        "total": 0
    },
    "Arduino": {
        "total": 0
    },
    "Raspberry": {
        "total": 0
    },
    "Bee": {
        "Bot": {
            "total": 0
        },
        "total": 0
    },
    "Sphero": {
        "total": 0
    },
    "Pikendusjuhe": {
        "total": 0
    },
    "Makey Makey": {
        "Starter": {
            "total": 0
        }
    },
    "iPad": {
        "total": 0
    },
    "Tahvelarvuti": {
        "total": 0
    },
    "Samsung": {
        "total": 0
    },
    "Galaxy": {
        "total": 0
    },
    "3D": {
        "printer": {
            "total": 0
        },
        "total": 0
    },
    "Blue-Bot": {
        "total": 0
    },
    "IR": {
        "total": 0
    },
    "Matatalab": {
        "õppematerjal": {
            "total": 0
        },
        "total": 0
    },
    "Tello": {
        "total": 0
    },
    "Sensor": {
        "total": 0
    },
    "NXT": {
        "total": 0
    },
    "laadija": {
        "akulaadija": {
            "total": 0
        },
        "total": 0
    },
    "kaabel": {
        "HDMI": {
            "total": 0
        },
        "total": 0
    },
    "mBot": {
        "total": 0
    },
    "mTiny": {
        "total": 0
    },
    "Pro-Bot": {
        "total": 0
    },
    "Midi": {
        "total": 0
    },
    "lisakomplekt": {
        "total": 0
    },
    "RGB": {
        "total": 0
    },
    "Bluetooth": {
        "total": 0
    },
    "Mesimumm": {
        "total": 0
    },
    "andur": {
        "total": 0
    },
    "matt": {
        "total": 0
    }
}


# In[7]:

import copy

array_of_tags = []

def tags_to_array(tags):
    for tag in list(tags.keys()):
        if type(tag) is str and tag != 'total':
            if tag not in array_of_tags:
                array_of_tags.append(tag)
                
    if tags is not str:
        tag_list = list(tags.keys())
        for tag in tag_list:
            if tag != "total":
                tags_to_array(tags[tag])
        
def get_tags(input_device, tags):
    output = ""
    for tag in tags:
        if tag in input_device:
            output+= tag + separator
    return output[:-1]
    
separator = ';'
tags_copy = copy.deepcopy(tags)
tags_to_array(tags_copy)


# In[9]:


# creating of table for frontend

devicesAmounts = {}
cleanDeviceAmountRegex = re.compile('(\s(\()?\d+(\s)?)tk')

masterList = []

def addInfoToList(row, device, amount):
    return [row[1], row[2], row[3], row[4], device, amount, get_tags(device, array_of_tags), row[6], row[7], row[8], row[9], row[10], row[11], row[12], row[13]]
        

def addInfoToMasterList(row):
    for device in list(devicesAmounts.keys()):
        masterList.append(addInfoToList(row, device, devicesAmounts[device]))
    

def sumInDict(key, value):
    key = cleanDeviceAmount(key)
    value = int(str(value).strip())
    if len(key) > 0 and isinstance(key, str) and isinstance(value, int):
        if key in devicesAmounts:
            devicesAmounts[key] += value
            return
        devicesAmounts[key] = value

    
def cleanDeviceAmount(input):
    cleaned = cleanDeviceAmountRegex.split(input)[0]
    if not re.search('(tk)+', cleaned):
        return cleaned
    else:
        return ""

lastKey = 'NaN'
lastHadAmount = True

firstRegex = re.compile('([\n]+|(;\s)+|[^a-z](\.\s)+|(,\s)+)')
deviceAmountRegex = re.compile('(\d+(\s)?)tk')

for row in taotlusvoor.itertuples():
    if row[5] == row[5]: #check for !NaN
        allDevices = firstRegex.split(row[5]) # Split on [ . , ; \n ]
        i = 0
        
        for device in allDevices:
            if device and not (re.search('^(;|,|\.|\)\.)', device)):
                
                deviceAmountWithSuffix = deviceAmountRegex.search(device)
                if (deviceAmountWithSuffix): # device had amount with it
                    if lastHadAmount: #adding amount to total
                        sumInDict(cleanDeviceAmount(device), deviceAmountWithSuffix.group(1).strip())
                    else:  #if it found number but last one didn't have one
                        
                        if len(cleanDeviceAmount(device)) < 2:
                            # if this amount doesn't have device in front of it, then the amount must be the last one's.
                            sumInDict(lastKey, deviceAmountWithSuffix.group(1))
                        
                        else: #this number has device infront of it. Therefore last one was a single device. And this amount
                            # belongs to current device
                            sumInDict(lastKey, 1)
                            sumInDict(device, deviceAmountWithSuffix.group(1))
                        lastKey = 'NaN'
                        lastHadAmount = True
                    
                else: # if device had no amount with it, then it's amount must come later or is just a single device
                    if not lastHadAmount: # last device didn't have an amount either
                        # then last one was single
                        sumInDict(lastKey, 1)
                        lastKey = cleanDeviceAmount(device)
                    else: # last device had an amount
                        # is it the last device in this row?
                        if i + 1 >= len(allDevices):
                            sumInDict(device, 1) #can't be any after this, must be single
                        else:
                            lastHadAmount = False #it's amount will come later
                            lastKey = cleanDeviceAmount(device)
                i+=1
        addInfoToMasterList(row)
        devicesAmounts = {}

# optimized
df = pd.DataFrame(masterList, columns=['kooli id', 'kooli nimi', 'maakond', 'kooli tüüp', 'seade', 'seadmete arv', 'tagid', '2014', '2015', '2016', '2017', '2018', '2019', '2020', '2021'])
json = df.to_json()
print(json)
