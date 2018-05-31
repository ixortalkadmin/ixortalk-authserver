/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2016-present IxorTalk CVBA
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
package com.ixortalk.authserver.web.rest;

import com.ixortalk.authserver.domain.Authority;
import com.ixortalk.authserver.repository.AuthorityRepository;
import com.ixortalk.authserver.security.AuthoritiesConstants;
import com.ixortalk.authserver.web.rest.dto.AuthorityDTO;
import com.ixortalk.authserver.web.rest.util.HeaderUtil;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.inject.Inject;
import javax.persistence.EntityManager;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import static org.springframework.http.MediaType.APPLICATION_JSON_VALUE;
import static org.springframework.web.bind.annotation.RequestMethod.*;

@RestController
@RequestMapping("/api")
public class AuthorityResource {

    @Inject
    private AuthorityRepository authorityRepository;

    @Inject
    private EntityManager entityManager;

    @RequestMapping(value = "/authorities", method = GET, produces = APPLICATION_JSON_VALUE)
    @Secured(AuthoritiesConstants.ADMIN)
    public ResponseEntity<List<AuthorityDTO>> getAllAuthorities()
        throws URISyntaxException {
        List<Authority> page = authorityRepository.findAll();
        List<AuthorityDTO> authorityDTOs = page.stream()
            .map(AuthorityDTO::new)
            .collect(Collectors.toList());
        return new ResponseEntity<>(authorityDTOs, HttpStatus.OK);
    }

}
