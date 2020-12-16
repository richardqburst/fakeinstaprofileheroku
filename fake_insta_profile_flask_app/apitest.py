import requests
import json
from statistics import mean 

#virat.kohli
#realdonaldtrump
#bonnymathews
#richard__tomy
#sachintendulkar

response = requests.get("https://www.instagram.com/dqsalmaan/?__a=1")
jsondata = response.json()
userdata = jsondata["graphql"]["user"]

#handle such cases in UI
if userdata["is_private"]:
	print("This profile is private and cannot be viewed")
	exit()

posts = userdata["edge_felix_video_timeline"]["count"] + userdata["edge_owner_to_timeline_media"]["count"]
flr = userdata["edge_followed_by"]["count"]
flw = userdata["edge_follow"]["count"]
bl = len(userdata["biography"])

defaultImageUrl = '44884218_345707102882519_2446069589734326272_n.jpg'
pic = 1 if defaultImageUrl not in userdata["profile_pic_url"] else 0

lin = 1 if userdata["external_url"] else 0

#average caption length
totalCaptionLengthVideos = 0
totalCaptionsPresent = 0

numVideos = 12 if userdata["edge_felix_video_timeline"]["count"] >= 12 else userdata["edge_felix_video_timeline"]["count"]
numImages = 12 if userdata["edge_owner_to_timeline_media"]["count"] >= 12 else userdata["edge_owner_to_timeline_media"]["count"]

if (numVideos+numImages):
	for i in range(numVideos):
		caption = userdata["edge_felix_video_timeline"]["edges"][i]["node"]["edge_media_to_caption"]["edges"]
		if len(caption):
			capLength = len(caption[0]["node"]["text"]) + len(userdata["edge_felix_video_timeline"]["edges"][i]["node"]["title"])
		else: 
			capLength = len(userdata["edge_felix_video_timeline"]["edges"][i]["node"]["title"])
		totalCaptionLengthVideos += capLength
		totalCaptionsPresent += 1 if capLength > 4 else 0

	totalCaptionLengthImages = 0

	for i in range(numImages):
		caption = userdata["edge_owner_to_timeline_media"]["edges"][i]["node"]["edge_media_to_caption"]["edges"]
		if len(caption):
			capLength = len(caption[0]["node"]["text"])
		else:
			capLength = 0
		totalCaptionLengthImages += capLength
		totalCaptionsPresent += 1 if capLength > 4 else 0

	cl = (totalCaptionLengthVideos + totalCaptionLengthImages)/(numImages+numVideos )
	cz = 1 - totalCaptionsPresent/(numImages+numVideos )
else:
	cl=0
	cz=1

#non image pertange
#wrong
picPosts = userdata["edge_owner_to_timeline_media"]["count"]
if picPosts:
	ni=1 - picPosts/posts
else:
	ni=0
#print(ni)

#Engagement rate Likes and comments
# Low accuracy because of analyzing lower number of posts
totalLikes = []
totalComments = []
for i in range(numVideos):
	totalLikes.append(userdata["edge_felix_video_timeline"]["edges"][i]["node"]["edge_liked_by"]["count"]/flr)
	totalComments.append(userdata["edge_felix_video_timeline"]["edges"][i]["node"]["edge_media_to_comment"]["count"]/flr)

for i in range(numImages):
	totalLikes.append(userdata["edge_owner_to_timeline_media"]["edges"][i]["node"]["edge_liked_by"]["count"]/flr)
	totalComments.append(userdata["edge_owner_to_timeline_media"]["edges"][i]["node"]["edge_media_to_comment"]["count"]/flr)

#erl = (totalLikes*100)/((numImages+numVideos)*flr)
#erc = (totalComments*100)/((numImages+numVideos)*flr)
erl = mean(totalLikes)*100
erc = mean(totalComments)*100

#location tag percentage
#location
totalLocationTags =0
for i in range(numVideos):
	totalLocationTags += 1 if userdata["edge_felix_video_timeline"]["edges"][i]["node"]["location"] else 0

for i in range(numImages):
	totalLocationTags += 1 if userdata["edge_owner_to_timeline_media"]["edges"][i]["node"]["location"] else 0

if (numImages+numVideos):
	loc = totalLocationTags/(numImages+numVideos)
else:
	loc=0


#Average hashtag count
totalHashtags = 0
captionText=""
for i in range(numVideos):
	textExists = userdata["edge_felix_video_timeline"]["edges"][i]["node"]["edge_media_to_caption"]["edges"]
	if textExists:
		captionText = textExists[0]["node"]["text"]
	else:
		captionText=""
	title = userdata["edge_felix_video_timeline"]["edges"][i]["node"]["title"]
	totalHashtags = totalHashtags + captionText.count("#")+title.count("#")

for i in range(numImages):
	textExists = userdata["edge_owner_to_timeline_media"]["edges"][i]["node"]["edge_media_to_caption"]["edges"]
	if textExists:
		captionText = textExists[0]["node"]["text"]
	else:
		captionText=""
	totalHashtags = totalHashtags + captionText.count("#")
if (numImages+numVideos):
	hc = totalHashtags/(numImages+numVideos)
else:
	hc = 0


url = 'http://127.0.0.1:5000//predict'
#jsondata = {"posts": posts, "flr" : flr, "flw":flw, "bl":bl,"pic":pic, "lin":lin, "cl":cl, "cz":cz, "ni":ni, "erl":erl,"erc":erc, "lt":loc, "hc":hc}
jsondata = {"posts": posts, "flr" : flr, "flw":flw, "bl":bl,"pic":pic, "lin":lin, "cl":cl, "cz":cz, "ni":ni, "lt":loc, "hc":hc}
#obj=[posts,flg,flr,bl,pic,lin]
data = json.dumps(jsondata)

print(data)
#x = requests.post(url, json = jsondata)
#print(x.text)