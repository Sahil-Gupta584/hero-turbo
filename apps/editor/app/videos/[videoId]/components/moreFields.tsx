// import { Checkbox, RadioGroup, Radio, Input, Select, SelectItem, Button, Tooltip, user } from "@heroui/react";
// import { UseFormRegister, UseFormWatch } from "react-hook-form";
// import { MdOutlineInfo } from "react-icons/md";
// import { captionCertifications, categories, commentModeration, commentsState, contentLanguages, licence } from "@/app/constants";
// import { text } from "stream/consumers";

// interface MoreFieldsProps {
//     register: UseFormRegister<FormInputs>
//     watch: UseFormWatch<FormInputs>
// }
// export default function MoreFields({ register, watch }: MoreFieldsProps) {
//     return (
//         <div className="space-y-8">

//             {/* Paid Promotion
//             <div>
//                 <ul className='mb-2'>
//                     <li className='text-xl font-bold'>Paid promotion</li>
//                     <li className='text-sm text-gray-500 my-1'>If you accepted anything of value from a third party to make your video, you must let us know. We'll show viewers a message telling them that your video contains paid promotion.</li>
//                 </ul>
//                 <Checkbox color="secondary" className="mt-1 mb-2"
//                     {...register("paidPromotion")}
//                 >
//                     My video contains paid promotion like a product placement, sponsorship or endorsement
//                 </Checkbox>
//                 <p className="text-sm text-gray-500 ">By selecting this box, you confirm that the paid promotion follows our ad policies, and any applicable laws and regulations.</p>
//             </div>
//  */}
//             {/* Altered Content */}
//             {/* <div >
//                 <h1 className='text-xl font-bold'>Altered content</h1>
//                 <h1 className='text-md font-semibold mt-1 mb-2'>Do any of the following describe your content?</h1>

//                 <ul className="list-disc pl-6 text-sm font-semibold ">
//                     <li>Makes a real person appear to say or do something that they didn't say or do</li>
//                     <li>Alters footage of a real event or place</li>
//                     <li>Generates a realistic-looking scene that didn't actually occur</li>
//                 </ul>
//                 <RadioGroup className="font-medium my-4">
//                     <Radio color='secondary' value="yes" {...register("alteredContent")}>Yes</Radio>
//                     <Radio color='secondary' value="no" {...register("alteredContent")}>No</Radio>
//                 </RadioGroup>
//                 <p className="text-sm text-gray-500 ">
//                     To follow YouTube's policy, you're required to tell us if your content is altered or synthetic and seems real. This includes realistic sounds or visuals made with AI or other tools.
//                 </p>
//                 <p className="text-sm text-gray-500 mt-2">
//                     Selecting 'yes' adds a <a href="https://support.google.com/youtube/answer/14328491?hl=en-GB#after_disclose" className="inline text-blue-500">disclosure</a> to your content.
//                 </p>
//             </div> */}

//             {/* Automatic Chapters */}
//             {/* <div>
//                 <ul className='mb-4'>
//                     <li className='text-xl font-bold'>Automatic chapters</li>
//                     <li className='text-sm text-gray-500 mt-1'>Chapters and key moments make your video easier to watch. You can overwrite automatic suggestions by creating your own chapters in the video description.  <a href="#" className="text-blue-500">Learn more</a></li>
//                 </ul>
//                 <Checkbox defaultSelected color="secondary"
//                     {...register("automaticChapters")}
//                 >
//                     Allow automatic chapters and key moments
//                 </Checkbox>
//             </div> */}

//             {/* <div>
//                 <ul className='mb-4'>
//                     <li className='text-xl font-bold'>Featured places</li>
//                     <li className='text-sm text-gray-500 mt-1'>
//                         Help viewers explore key places in your video. These are public places like restaurants and shops – we don't display your current location or other private info.
//                     </li>                    </ul>
//                 <Checkbox defaultSelected color="secondary"
//                     {...register("automaticChapters")}
//                 >
//                     Allow automatic places
//                 </Checkbox>
//             </div> */}

//             {/* <div>
//                 <ul className='mb-4'>
//                     <li className='text-xl font-bold'>
//                         Automatic concepts
//                         <span className="text-medium bg-gray-300 p-[2px_6px] ml-4  rounded-md font-semibold">
//                             Experiment
//                         </span>
//                     </li>
//                     <li className='text-sm text-gray-500 mt-1'>
//                         Help viewers learn more about unfamiliar terms without leaving the video. Concepts mentioned in your video may automatically appear in the description.
//                     </li>
//                 </ul>
//                 <Checkbox defaultSelected color="secondary"
//                     {...register("automaticChapters")}
//                 >
//                     Allow automatic concepts
//                 </Checkbox>
//             </div> */}
// {/* 
//             <div>
//                 <ul className='mb-4'>
//                     <li className='text-xl font-bold'>Tags</li>
//                     <li className='text-sm text-gray-500 mt-1'>
//                         Tags can be useful if content in your video is commonly misspelt. Otherwise, tags play a minimal role in helping viewers to find your video.
//                     </li>
//                 </ul>
//                 <Input
//                     variant="bordered"
//                     placeholder='Add tags'
//                     description='Enter a comma after each tag'
//                     type="email"
//                     classNames={{ inputWrapper: [' p-[22px_1rem]'] }}
//                 />
//             </div> */}

//             {/* <div>
//                 <ul className='mb-4'>
//                     <li className='text-xl font-bold'>
//                         Language and captions certification
//                     </li>
//                     <li className='text-sm text-gray-500 mt-1'>
//                         Select your video's language and, if needed, a caption certification
//                     </li>
//                 </ul>
//                 <Select
//                     variant='bordered'
//                     className="max-w-xs m-1"
//                     label='Video Language'
//                     placeholder="Select"
//                     classNames={{
//                         label: [" font-semibold"],
//                         trigger: [" p-[22px_1rem] "]
//                     }}
//                     {...register("playlist")}
//                 >
//                     {contentLanguages.map((lang) => (
//                         <SelectItem key={lang.languageCode}>{lang.displayName}</SelectItem>
//                     ))}
//                 </Select>
//                 <Select
//                     variant='bordered'
//                     className="max-w-xs m-1"
//                     label='Caption Certification '
//                     placeholder="Select"
//                     classNames={{
//                         label: [" font-semibold"],
//                         trigger: [" p-[22px_1rem] "],
//                         popoverContent: ['w-fit']
//                     }}
//                     defaultSelectedKeys={["None"]}
//                     {...register("playlist")}
//                 >
//                     {captionCertifications.map((text) => (
//                         <SelectItem key={text}>{text}</SelectItem>
//                     ))}
//                 </Select>
//                 <Select
//                     variant='bordered'
//                     className="max-w-xs m-1"
//                     label='Title and Description language'
//                     placeholder="Select"
//                     classNames={{
//                         label: [" font-semibold"],
//                         trigger: [" p-[22px_1rem] "],
//                         popoverContent: ['w-fit']
//                     }}
//                     {...register("playlist")}
//                 >
//                     {captionCertifications.map((text, i) => (
//                         <SelectItem key={i}>{text}</SelectItem>
//                     ))}
//                 </Select>
//             </div> */}

//             {/* <div>
//                 <ul className='mb-2'>
//                     <li className='text-xl font-bold'>Licence</li>
//                     <li className='text-sm text-gray-500 mt-1'>
//                         Learn about
//                         <a href="https://support.google.com/youtube/answer/2797468?hl=en-GB" className="inline text-blue-500"> licence types</a>.
//                     </li>
//                 </ul>
//                 <Select
//                     variant='bordered'
//                     className="max-w-xs m-1"
//                     label='Title and Description language'
//                     placeholder="Select"
//                     classNames={{
//                         label: [" font-semibold"],
//                         trigger: [" p-[22px_1rem] "],
//                         popoverContent: ['w-fit']
//                     }}
//                     defaultSelectedKeys={["Standard YouTube Licence"]}
//                     {...register("playlist")}
//                 >
//                     {licence.map((text) => (
//                         <SelectItem key={text}>{text}</SelectItem>
//                     ))}
//                 </Select>
//                 <br />
//                 <Checkbox
//                     defaultSelected
//                     classNames={{ label: ['flex items-center gap-2'] }}
//                     color="secondary"
//                     className="m-1 p-0 mt-4"
//                     {...register("paidPromotion")}
//                 >
//                     Allow Embedding
//                     <Tooltip content="Allow others to embed your video in their sites.">
//                         <MdOutlineInfo className='w-5 h-5' />
//                     </Tooltip>
//                 </Checkbox>
//                 <br />
//                 <Checkbox defaultSelected color="secondary" className="m-1 p-0"
//                     {...register("paidPromotion")}
//                 >
//                     Publish to subscriptions feed and notify subscribers
//                 </Checkbox>

//             </div> */}

//             {/* <div>
//                 <ul className='mb-2'>
//                     <li className='text-xl font-bold'>Shorts remixing</li>
//                     <li className='text-sm text-gray-500 mt-1'>
//                         Let others create Shorts using content from this video. If you don't allow remixing, Shorts remixed from this video will be permanently deleted. Learn more
//                         <a href="https://support.google.com/youtube/answer/10623810?hl=en-GB#opt-out" className="inline text-blue-500"> Learn more</a>.
//                     </li>
//                 </ul>
//                 <RadioGroup className="font-medium my-4">
//                     <Radio defaultChecked color='secondary' value="yes" {...register("alteredContent")}>Allow video and audio remixing                    </Radio>
//                     <Radio color='secondary' value="true" {...register("alteredContent")}>Allow only audio remixing</Radio>
//                     <Radio color='secondary' value="false" {...register("alteredContent")}>Don't allow remixing</Radio>
//                 </RadioGroup>
//             </div> */}

//             <div>
//                 <ul className='mb-4'>
//                     <li className='text-xl font-bold'>Category</li>
//                     <li className='text-sm text-gray-500 mt-1'>
//                         Add your video to a category so that viewers can find it more easily
//                     </li>
//                 </ul>
//                 <Select
//                     variant='bordered'
//                     className="max-w-xs m-1"
//                     placeholder="People and blogs"
//                     classNames={{
//                         label: [" font-semibold"],
//                         trigger: [" p-[22px_1rem] "],
//                         popoverContent: ['w-fit']
//                     }}
//                     {...register("playlistIds")}
//                 >
//                     {categories.map((text) => (
//                         <SelectItem key={text.id}>{text.label}</SelectItem>
//                     ))}
//                 </Select>
//             </div>

//             {/* <div>
//                 <ul className='mb-4'>
//                     <li className='text-xl font-bold'>
//                         Comments and ratings
//                     </li>
//                     <li className='text-sm text-gray-500 mt-1'>
//                         Choose if and how you want to show comments
//                     </li>
//                 </ul>
//                 <Select
//                     variant='bordered'
//                     className="max-w-xs m-1"
//                     label='Comments'
//                     placeholder="Select"
//                     classNames={{
//                         label: [" font-semibold"],
//                         trigger: [" p-[22px_1rem] "]
//                     }}
//                     {...register("playlist")}
//                     defaultSelectedKeys={["On"]}
//                 >
//                     {commentsState.map((text) => (
//                         <SelectItem key={text}>{text}</SelectItem>
//                     ))}
//                 </Select>

//                 <Select
//                     variant="bordered"
//                     className="max-w-xs m-1"
//                     label="Moderation"
//                     placeholder="Select"
//                     classNames={{
//                         label: ["font-semibold"],
//                         trigger: ["p-[22px_1rem]"],
//                         popoverContent: ["w-fit"],
//                     }}
//                     defaultSelectedKeys={["basic"]}
//                     {...register("playlist")}
//                 >
//                     {commentModeration.map((moderation) => (
//                         <SelectItem key={moderation.title.toLowerCase()} textValue={moderation.title}>
//                             <div className="flex flex-col">
//                                 <span className="text-small">{moderation.title}</span>
//                                 <span className="text-tiny text-default-400">{moderation.desc}</span>
//                             </div>
//                         </SelectItem>
//                     ))}
//                 </Select>


//                 <Select
//                     variant='bordered'
//                     className="max-w-xs m-1"
//                     label='Sort by'
//                     placeholder="Select"
//                     classNames={{
//                         label: [" font-semibold"],
//                         trigger: [" p-[22px_1rem] "],
//                         popoverContent: ['w-fit']
//                     }}
//                     {...register("playlist")}
//                     defaultSelectedKeys={["Top"]}
//                 >
//                     {['Top', "Newest"].map((text) => (
//                         <SelectItem key={text}>{text}</SelectItem>
//                     ))}
//                 </Select>
//                 <br />
//                 <Checkbox defaultSelected color="secondary" className="my-3"
//                     {...register("paidPromotion")}
//                 >
//                     Show how many viewers like this video
//                 </Checkbox>
//             </div> */}

//         </div>
//     )
// }