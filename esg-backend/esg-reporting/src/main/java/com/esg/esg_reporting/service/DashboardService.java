package com.esg.esg_reporting.service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.esg.esg_reporting.entity.MetricEntry;
import com.esg.esg_reporting.repository.MetricEntryRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final MetricEntryRepository metricEntryRepository;

    public List<MetricEntry> getAllMetricEntries() {
        return metricEntryRepository.findAll();
    }

    public Map<String, Long> getMetricCountByStatus() {

        return metricEntryRepository.findAll()
                .stream()
                .collect(Collectors.groupingBy(
                        MetricEntry::getReviewStatus,
                        Collectors.counting()));
    }
}