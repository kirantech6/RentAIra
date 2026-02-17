import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { Send, User, Search } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { cn } from '../lib/utils';
import { Card } from '../components/ui/Card';

const MessagesPage = () => {
    const { user } = useAuth();
    const { messages, addMessage } = useData();
    const [selectedChat, setSelectedChat] = useState(null);
    const [newMessage, setNewMessage] = useState('');

    // Group messages by conversation (simplified: just grouping by 'other' user)
    const conversations = React.useMemo(() => {
        const convos = {};
        messages.forEach(msg => {
            const otherId = msg.senderId === user.id ? msg.receiverId : msg.senderId;
            if (!convos[otherId]) {
                convos[otherId] = {
                    userId: otherId,
                    name: msg.senderId === user.id ? 'Recipient' : 'Sender', //Ideally lookup user name
                    lastMessage: msg,
                    messages: []
                };
            }
            convos[otherId].messages.push(msg);
            // Verify conversation timestamp is latest
            if (new Date(msg.timestamp) > new Date(convos[otherId].lastMessage.timestamp)) {
                convos[otherId].lastMessage = msg;
            }
        });
        return Object.values(convos).sort((a, b) => new Date(b.lastMessage.timestamp) - new Date(a.lastMessage.timestamp));
    }, [messages, user.id]);

    // Dummy user names lookup for prototype
    const getUserName = (id) => {
        if (id === 'u2') return 'Jane Landlord';
        if (id === 'u1') return 'John Renter';
        if (id === 'u3') return 'Bob Manager';
        return 'User';
    };

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedChat) return;

        addMessage({
            senderId: user.id,
            receiverId: selectedChat.userId,
            content: newMessage,
        });
        setNewMessage('');
    };

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 h-[calc(100vh-4rem)]">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full">
                {/* Chat List */}
                <Card className="flex flex-col h-full col-span-1 border-r md:border-r-0 overflow-hidden">
                    <div className="p-4 border-b">
                        <h2 className="text-lg font-semibold mb-4">Messages</h2>
                        <div className="relative">
                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                            <Input placeholder="Search messages..." className="pl-9" />
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        {conversations.length > 0 ? (
                            conversations.map(chat => (
                                <div
                                    key={chat.userId}
                                    onClick={() => setSelectedChat(chat)}
                                    className={cn(
                                        "p-4 border-b cursor-pointer hover:bg-gray-50 transition-colors",
                                        selectedChat?.userId === chat.userId ? "bg-indigo-50 border-indigo-200" : ""
                                    )}
                                >
                                    <div className="flex items-center space-x-3">
                                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                                            <User className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-baseline">
                                                <h3 className="text-sm font-medium text-gray-900 truncate">
                                                    {getUserName(chat.userId)}
                                                </h3>
                                                <span className="text-xs text-gray-500">
                                                    {new Date(chat.lastMessage.timestamp).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-500 truncate">{chat.lastMessage.content}</p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="p-8 text-center text-gray-500">No conversations yet.</div>
                        )}
                    </div>
                </Card>

                {/* Chat Window */}
                <Card className="flex flex-col h-full col-span-2 overflow-hidden">
                    {selectedChat ? (
                        <>
                            <div className="p-4 border-b flex items-center justify-between bg-white">
                                <div className="flex items-center space-x-3">
                                    <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
                                        <span className="text-indigo-600 font-medium text-sm">
                                            {getUserName(selectedChat.userId).charAt(0)}
                                        </span>
                                    </div>
                                    <h3 className="font-semibold text-gray-900">{getUserName(selectedChat.userId)}</h3>
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                                {messages
                                    .filter(m => (m.senderId === user.id && m.receiverId === selectedChat.userId) ||
                                        (m.senderId === selectedChat.userId && m.receiverId === user.id))
                                    .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
                                    .map((msg) => (
                                        <div
                                            key={msg.id}
                                            className={cn(
                                                "flex w-max max-w-[75%] rounded-lg p-3 text-sm",
                                                msg.senderId === user.id
                                                    ? "ml-auto bg-indigo-600 text-white"
                                                    : "bg-white border border-gray-200 text-gray-900"
                                            )}
                                        >
                                            <div>
                                                <p>{msg.content}</p>
                                                <span className={cn(
                                                    "text-xs mt-1 block",
                                                    msg.senderId === user.id ? "text-indigo-200" : "text-gray-400"
                                                )}>
                                                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>

                            <div className="p-4 bg-white border-t">
                                <form onSubmit={handleSendMessage} className="flex space-x-2">
                                    <Input
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        placeholder="Type a message..."
                                        className="flex-1"
                                    />
                                    <Button type="submit" size="icon">
                                        <Send className="h-4 w-4" />
                                    </Button>
                                </form>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-gray-500 bg-gray-50">
                            <div className="h-16 w-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                                <Send className="h-8 w-8 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900">Your Messages</h3>
                            <p>Select a conversation to start chatting.</p>
                        </div>
                    )}
                </Card>
            </div>
        </div>
    );
};

export default MessagesPage;
