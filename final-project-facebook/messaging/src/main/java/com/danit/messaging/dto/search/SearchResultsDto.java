package com.danit.messaging.dto.search;

import lombok.Data;

import java.util.List;

@Data
public class SearchResultsDto {
    private List<GroupChatSearchDto> groupChats;
    private List<PrivateMessageSearchDto> privateMessages;
}