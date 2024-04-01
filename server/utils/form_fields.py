from bs4 import BeautifulSoup
import requests

# VOXEL
link = "https://jobs.lever.co/Voxel/87e2acda-8b4d-4fd9-aafe-2b606f0e3d1f/apply"

# # Rover
# link = "https://jobs.lever.co/Rover/0084b9a2-d129-4f1d-81d1-c5a63ed547d3/apply"


## get all the imput and select fieldsf from the form
def get_form_fields(link):
    response = requests.get(link)
    soup = BeautifulSoup(response.text, 'html.parser')
    form = soup.find("form")
    input_feilds = form.find_all("input")
    select_feilds = form.find_all("select")
    return input_feilds, select_feilds


res = get_form_fields(link)
print("Input Feilds")
for i in res[0]:
    print(i)
    print("\n")
# print("Select Feilds")
# for i in res[1]:
#     print(i)
#     print("\n")


# <input name="cards[fb5c103c-4111-4530-94b9-07965c4a027e][baseTemplate]" type="hidden" 
# value='{"createdAt":1675900887306,"updatedAt":1675900887306,"text":"General Questionnaire - Seattle (Visa)",
# "instructions":"","type":"posting","accountId":"0084b9a2-d129-4f1d-81d1-c5a63ed547d3",
# "fields":[{"type":"file-upload","text":"Cover Letter:","description":"","required":false,
#            "id":"2b872b38-5802-4e7f-b868-f37e161f81ce"},{"type":"text","text":"How should we refer to you (nickname and/or pronouns)?",
#                                                          "description":"","required":false,"id":"a7e56a52-6846-4772-a3e8-28fb23173026"},
#                                                          {"type":"multiple-choice","text":"Do you or will you require sponsorship in the future to work in the U.S.?",
#                                                           "description":"","required":true,"id":"93dbbd63-2f2f-48e6-bab6-968cbc235e2c",
#                                                           "options":[{"text":"Yes","optionId":"9ca031f2-58ab-4c9a-9897-729e498e7b2e"},
#                                                                      {"text":"No","optionId":"63fe4b9d-e366-4c1e-8b33-0bfcab75e022"}]},
#                                                                      {"type":"text","text":"Were you referred by anyone at Rover.com? If so, who were you referred by?",
#                                                                       "description":"","required":true,"id":"782a147e-9ea3-4fbb-ad10-7d4f9878d975"},
#                                                                       {"type":"text","text":"What is your desired salary?","description":"",
#                                                                        "required":true,"id":"3ccdaba5-5084-4af6-893f-d1278c0ecec7"},
#                                                                        {"type":"text","text":"What is your desired total compensation?","description":"","required":true,
#                                                                         "id":"1da757c0-1109-41cf-bec8-de13f28a0440"},{"type":"textarea","text":"Do you currently live in or near Seattle? If not, are you willing to relocate to Seattle for the right opportunity?",
#                                                                                                                       "description":"","required":true,"id":"5aeebb71-8907-483f-a41c-8ca0e588a5a5"}],
# "secret":false,"id":"fb5c103c-4111-4530-94b9-07965c4a027e"}'/>
    

# <input name="cards[a7acbb62-8896-4478-8f34-9d2da2683d17][baseTemplate]" type="hidden" 
# value='{"createdAt":1687390559049,"updatedAt":1687390559049,"text":"Additional Questions:","instructions":"",
# "type":"posting","accountId":"e6e96a9d-03d1-4ce8-8e99-ac194b43137a",
# "fields":[{"type":"multiple-choice",
# "text":"Are you legally authorized to work in the US?",
# "description":"","required":true,"id":"b02bc081-5b45-4761-8479-130cf1234c59",
# "options":[{"text":"Yes","optionId":"75e2c723-7090-4572-8241-57f6800b7d46"},{"text":"No","optionId":"f9831bb0-5a8a-4d46-996a-43524143a3c9"}]},
# {"type":"multiple-choice","text":"Will you now or in the future require sponsorship for employment?","description":"",
# "required":true,"id":"4a22878a-20ad-4c4f-ae1c-c1ef549defdf","options":[{"text":"Yes","optionId":"dd0e5c85-5019-4ab1-88e7-600882ae6143"},
# {"text":"No","optionId":"8efba787-e7f7-4b34-a140-6c79766c28dd"}]},{"type":"textarea","text":"Why should we consider you for this role?","description":"",
#                         "required":false,"id":"a58cd5c3-e901-443a-8d86-9b720c825a30"},
#                         {"type":"textarea",
#                     "text":"What interests you about Voxel?","description":"",
#                     "required":false,"id":"4ada60fd-b08b-4c75-a6cd-582345786e77"}],"id":"a7acbb62-8896-4478-8f34-9d2da2683d17"}'/>

<input name="cards[fb5c103c-4111-4530-94b9-07965c4a027e][baseTemplate]" type="hidden"
value='{"key":"value", "key":"value", "key":"value",
"fields":["type":"value", "text":"question", "decription":"value", "required":boolean, "id":"value", 
          "options":[{"text":"value", "optionId":"value"}, {"text":"value", "optionId":"value"}]] >

# <input name="cards[fb5c103c-4111-4530-94b9-07965c4a027e][baseTemplate]" type="hidden"
# value='{"key":"value", "key":"value", "key":"value",
# "fields":[{"type":"multiple-choice","text":"Are you legally authorized to work in the US?","desc":"","required":true,"id":"b02bc081-5b45-4761-8479-130cf1234c59",