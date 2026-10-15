package com.esg.esg_reporting.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.esg.esg_reporting.entity.ReportingPeriod;
import com.esg.esg_reporting.repository.ReportingPeriodRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ReportingPeriodService {

    private final ReportingPeriodRepository repository;

    public ReportingPeriod saveReportingPeriod(ReportingPeriod period) {
        return repository.save(period);
    }

    public List<ReportingPeriod> getAllReportingPeriods() {
        return repository.findAll();
    }

    public ReportingPeriod getReportingPeriodById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Reporting period not found"));
    }

    public void deleteReportingPeriod(Long id) {
        repository.deleteById(id);
    }
}