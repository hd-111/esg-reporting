package com.esg.esg_reporting.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.esg.esg_reporting.entity.MetricEntry;

public interface MetricEntryRepository extends JpaRepository<MetricEntry, Long> {

}